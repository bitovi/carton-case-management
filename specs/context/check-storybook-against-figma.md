# Check Storybook Against Figma

This document outlines a strategy for validating that Storybook component implementations match their Figma design sources, using a combination of perceptual diffing and AI-powered analysis.

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Initial Validation (Figma → Storybook)                             │
│                                                                             │
│   For each component variant:                                               │
│   1. Download Figma variant image                                           │
│   2. Capture Storybook story screenshot                                     │
│   3. Generate diff mask                                                     │
│   4. AI analyzes all three images → suggests fixes                          │
│   5. Developer applies fixes                                                │
│   6. Repeat until match (or max 3 rounds)                                   │
│   7. Save approved Storybook screenshot as baseline                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Regression Testing (Storybook → Baseline)                          │
│                                                                             │
│   On every test run:                                                        │
│   1. Capture current Storybook screenshot                                   │
│   2. Compare against saved baseline (tight threshold, e.g., 0.1%)           │
│   3. Pass/fail with no AI needed                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Why This Approach?

| Challenge | Solution |
|-----------|----------|
| Figma renders differently than browsers | AI judges "intent match", not pixel-perfect |
| Need fast CI tests | Phase 2 uses fast local diff only |
| AI costs | AI only runs during initial validation, not every test |
| Rendering quirks (fonts, antialiasing) | Storybook-to-Storybook comparison can be strict |
| Knowing where problems are | Diff mask guides AI to specific issues |

---

## Step 1: Get Figma Images for Each Component/Story

### Challenge

The Figma MCP tools can fetch metadata and screenshots, but agents cannot directly save binary image files to disk.

### Solution: Two-Step Process

**1a. Agent generates a manifest via MCP:**

```typescript
// Use mcp_figma_get_metadata to find all variant node IDs
// Write manifest file:
{
  "fileKey": "MQUbIrlfuM8qnr9XZ7jc82",
  "component": "Input",
  "figmaUrl": "https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/...",
  "variants": [
    { 
      "nodeId": "279-98539", 
      "name": "Size-Regular-State-Default",
      "storyId": "obra-input--default"
    },
    { 
      "nodeId": "279-98540", 
      "name": "Size-Regular-State-Error",
      "storyId": "obra-input--state-error"
    },
    { 
      "nodeId": "279-98600", 
      "name": "Size-Large-State-Default",
      "storyId": "obra-input--size-large"
    }
  ],
  "outputDir": "__figma_snapshots__"
}
```

**1b. Script downloads images via Figma REST API:**

```typescript
// scripts/download-figma-snapshots.ts
import fs from 'fs';
import path from 'path';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

interface Manifest {
  fileKey: string;
  component: string;
  variants: Array<{
    nodeId: string;
    name: string;
    storyId: string;
  }>;
  outputDir: string;
}

async function downloadFigmaSnapshots(manifestPath: string) {
  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const { fileKey, variants, outputDir } = manifest;
  
  // Figma API allows bulk image export
  const nodeIds = variants.map(v => v.nodeId).join(',');
  
  const response = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${nodeIds}&format=png&scale=2`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN! } }
  );
  
  const { images } = await response.json();
  
  // Download each image
  for (const variant of variants) {
    const imageUrl = images[variant.nodeId.replace('-', ':')];
    if (!imageUrl) {
      console.warn(`No image found for ${variant.name}`);
      continue;
    }
    
    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    const outputPath = path.join(outputDir, `${variant.name}.png`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Downloaded: ${variant.name}`);
  }
}
```

**Usage:**

```bash
# Set up token
export FIGMA_TOKEN="your-figma-personal-access-token"

# Download all variant images
npm run figma:download-snapshots -- --manifest=./components/Input/.figma-manifest.json
```

### Directory Structure

```
components/obra/Input/
├── Input.tsx
├── Input.stories.tsx
├── .figma-manifest.json           # Generated by agent
└── __figma_snapshots__/
    ├── Size-Mini-State-Default.png
    ├── Size-Small-State-Default.png
    ├── Size-Regular-State-Default.png
    ├── Size-Large-State-Default.png
    ├── Size-Regular-State-Error.png
    ├── Size-Regular-State-Disabled.png
    └── Roundness-Round-State-Default.png
```

---

## Step 2: Get Images for Storybook Stories

### Using Playwright to Screenshot Stories

```typescript
// scripts/capture-storybook-screenshots.ts
import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

interface Manifest {
  variants: Array<{
    name: string;
    storyId: string;
  }>;
  outputDir: string;
}

async function captureStorybookScreenshots(
  manifestPath: string,
  storybookUrl: string = 'http://localhost:6006'
) {
  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set consistent viewport
  await page.setViewportSize({ width: 1280, height: 720 });
  
  const outputDir = manifest.outputDir.replace('__figma_snapshots__', '__storybook_snapshots__');
  fs.mkdirSync(outputDir, { recursive: true });
  
  for (const variant of manifest.variants) {
    // Navigate to story iframe (isolated component)
    const storyUrl = `${storybookUrl}/iframe.html?id=${variant.storyId}&viewMode=story`;
    await page.goto(storyUrl);
    
    // Wait for component to render
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Extra buffer for animations
    
    // Find and screenshot just the component
    const component = page.locator('#storybook-root > *').first();
    const screenshot = await component.screenshot();
    
    const outputPath = path.join(outputDir, `${variant.name}.png`);
    fs.writeFileSync(outputPath, screenshot);
    
    console.log(`Captured: ${variant.name}`);
  }
  
  await browser.close();
}
```

### Alternative: Using Storycap or Chromatic

```bash
# Storycap - captures all stories as images
npx storycap http://localhost:6006 --outDir __screenshots__

# Or use Storybook's test-runner with screenshots
npx test-storybook --coverage
```

---

## Step 3: Generate Diff Mask

### Using Resemble.js for Rich Diff Data

```typescript
// lib/visual-diff.ts
import Resemble from 'resemblejs';
import fs from 'fs';
import path from 'path';

interface DiffResult {
  match: boolean;
  mismatchPercentage: number;
  diffBounds: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  diffImagePath: string;
  analysisTime: number;
}

async function generateDiff(
  figmaImagePath: string,
  storybookImagePath: string,
  outputDir: string
): Promise<DiffResult> {
  const figmaImage = fs.readFileSync(figmaImagePath);
  const storybookImage = fs.readFileSync(storybookImagePath);
  
  return new Promise((resolve) => {
    Resemble(figmaImage)
      .compareTo(storybookImage)
      .ignoreAntialiasing()
      .onComplete((data) => {
        // Save diff image
        const diffImagePath = path.join(outputDir, 'diff.png');
        fs.writeFileSync(diffImagePath, data.getBuffer());
        
        resolve({
          match: data.rawMisMatchPercentage < 1.0,
          mismatchPercentage: data.rawMisMatchPercentage,
          diffBounds: data.diffBounds,
          diffImagePath,
          analysisTime: data.analysisTime,
        });
      });
  });
}
```

### Creating a Composite Debug Image

For easier AI analysis, combine all three images:

```typescript
// lib/composite-image.ts
import sharp from 'sharp';
import path from 'path';

async function createCompositeImage(
  figmaPath: string,
  storybookPath: string,
  diffPath: string,
  outputPath: string
): Promise<string> {
  const figma = sharp(figmaPath);
  const storybook = sharp(storybookPath);
  const diff = sharp(diffPath);
  
  // Get dimensions
  const { width, height } = await figma.metadata();
  
  // Create side-by-side-by-side composite
  const composite = await sharp({
    create: {
      width: width! * 3 + 40, // 3 images + padding
      height: height! + 60,   // Image + label space
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: await figma.toBuffer(), top: 40, left: 10 },
    { input: await storybook.toBuffer(), top: 40, left: width! + 20 },
    { input: await diff.toBuffer(), top: 40, left: width! * 2 + 30 },
    // Labels would require text rendering (use SVG overlay)
  ])
  .png()
  .toFile(outputPath);
  
  return outputPath;
}
```

---

## Step 4: AI Analysis with Diff Guidance

### Prompt Structure

```typescript
// lib/ai-analysis.ts
interface AnalysisResult {
  overallMatch: boolean;
  confidence: number;
  issues: Array<{
    location: string;
    property: string;
    figmaValue: string;
    actualValue: string;
    suggestedFix: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  summary: string;
}

function buildAnalysisPrompt(
  mismatchPercentage: number,
  diffBounds: { top: number; left: number; bottom: number; right: number }
): string {
  return `
You are comparing a Figma design to its React/Storybook implementation.

## Images Provided
1. **Figma Design** (left): The source of truth
2. **Storybook Implementation** (center): The current code output
3. **Diff Mask** (right): Red/pink pixels show where they differ

## Diff Analysis Data
- Mismatch: ${mismatchPercentage.toFixed(2)}%
- Problem region: top=${diffBounds.top}px, left=${diffBounds.left}px, bottom=${diffBounds.bottom}px, right=${diffBounds.right}px

## Acceptable Differences (IGNORE these)
- Slight font rendering/antialiasing variations
- Sub-pixel color differences due to color space
- Minor shadow blur differences

## Unacceptable Differences (REPORT these)
- Wrong spacing or padding (off by 2px+)
- Incorrect border radius
- Wrong border color or width
- Missing or extra elements
- Incorrect sizing
- Wrong background color

## Your Task
Analyze the RED highlighted areas in the diff mask. For each issue:

1. Identify the CSS property that differs
2. Estimate the Figma value vs implemented value
3. Suggest a Tailwind CSS fix

## Response Format (JSON)
{
  "overallMatch": boolean,
  "confidence": 0.0-1.0,
  "issues": [
    {
      "location": "border",
      "property": "border-radius",
      "figmaValue": "4px",
      "actualValue": "6px", 
      "suggestedFix": "Change rounded-md to rounded",
      "severity": "medium"
    }
  ],
  "summary": "Brief overall assessment"
}

If the differences are only acceptable variations, return:
{
  "overallMatch": true,
  "confidence": 0.95,
  "issues": [],
  "summary": "Implementation matches design within acceptable tolerance"
}
`;
}
```

### Calling the AI

```typescript
async function analyzeWithAI(
  compositeImagePath: string,
  mismatchPercentage: number,
  diffBounds: object
): Promise<AnalysisResult> {
  const imageBuffer = fs.readFileSync(compositeImagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: base64Image,
          },
        },
        {
          type: 'text',
          text: buildAnalysisPrompt(mismatchPercentage, diffBounds),
        },
      ],
    }],
  });
  
  // Parse JSON from response
  const content = response.content[0];
  if (content.type === 'text') {
    return JSON.parse(content.text);
  }
  throw new Error('Unexpected response format');
}
```

---

## Step 5: Iterative Refinement Loop

### Main Validation Flow

```typescript
// scripts/validate-component.ts
interface ValidationConfig {
  maxRounds: number;
  passThreshold: number;  // mismatch % to auto-pass
  componentPath: string;
}

async function validateComponent(config: ValidationConfig) {
  const { maxRounds, passThreshold, componentPath } = config;
  
  const manifestPath = path.join(componentPath, '.figma-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  for (const variant of manifest.variants) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Validating: ${variant.name}`);
    console.log('='.repeat(60));
    
    let round = 0;
    let lastResult: AnalysisResult | null = null;
    
    while (round < maxRounds) {
      round++;
      console.log(`\nRound ${round}/${maxRounds}`);
      
      // 1. Capture current Storybook screenshot
      await captureStoryScreenshot(variant);
      
      // 2. Generate diff
      const diffResult = await generateDiff(
        path.join(componentPath, '__figma_snapshots__', `${variant.name}.png`),
        path.join(componentPath, '__storybook_snapshots__', `${variant.name}.png`),
        path.join(componentPath, '__diff__')
      );
      
      console.log(`Mismatch: ${diffResult.mismatchPercentage.toFixed(2)}%`);
      
      // 3. Check if we pass threshold
      if (diffResult.mismatchPercentage < passThreshold) {
        console.log(`✅ PASS - Below ${passThreshold}% threshold`);
        
        // Save as approved baseline
        await saveBaseline(variant, componentPath);
        break;
      }
      
      // 4. Create composite and analyze with AI
      const compositePath = await createCompositeImage(
        path.join(componentPath, '__figma_snapshots__', `${variant.name}.png`),
        path.join(componentPath, '__storybook_snapshots__', `${variant.name}.png`),
        diffResult.diffImagePath,
        path.join(componentPath, '__diff__', 'composite.png')
      );
      
      const analysis = await analyzeWithAI(
        compositePath,
        diffResult.mismatchPercentage,
        diffResult.diffBounds
      );
      
      lastResult = analysis;
      
      // 5. Report findings
      if (analysis.overallMatch) {
        console.log(`✅ AI APPROVED - ${analysis.summary}`);
        await saveBaseline(variant, componentPath);
        break;
      }
      
      console.log(`\n⚠️  Issues found (${analysis.issues.length}):`);
      for (const issue of analysis.issues) {
        console.log(`   - ${issue.property}: ${issue.figmaValue} → ${issue.actualValue}`);
        console.log(`     Fix: ${issue.suggestedFix}`);
      }
      
      // 6. If not last round, prompt for fixes
      if (round < maxRounds) {
        console.log(`\n👉 Apply fixes and press Enter to re-check...`);
        await waitForEnter();
      }
    }
    
    // Final status
    if (round >= maxRounds && lastResult && !lastResult.overallMatch) {
      console.log(`\n❌ FAILED after ${maxRounds} rounds`);
      console.log(`   Final mismatch: ${lastResult.summary}`);
      
      // Save report for review
      await saveFailureReport(variant, lastResult, componentPath);
    }
  }
}

async function saveBaseline(variant: Variant, componentPath: string) {
  const source = path.join(componentPath, '__storybook_snapshots__', `${variant.name}.png`);
  const dest = path.join(componentPath, '__baselines__', `${variant.name}.png`);
  
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
  
  console.log(`   Saved baseline: ${dest}`);
}
```

### Exit Conditions

| Condition | Action |
|-----------|--------|
| Diff < threshold (e.g., 1%) | ✅ Auto-pass, save baseline |
| AI says "overallMatch: true" | ✅ Pass, save baseline |
| Max rounds (3) reached | ❌ Fail, save report for review |
| AI confidence > 0.9 on minor issues | ⚠️ Pass with warnings |

---

## Step 6: Regression Testing Against Saved Baseline

Once Phase 1 validation passes, we have a **Storybook baseline** that's been verified against Figma. Future tests compare Storybook-to-Storybook:

### Fast Regression Test

```typescript
// scripts/regression-test.ts
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';

interface RegressionResult {
  pass: boolean;
  mismatchPixels: number;
  mismatchPercentage: number;
  diffImagePath?: string;
}

async function runRegressionTest(
  baselinePath: string,
  currentPath: string,
  diffOutputPath: string,
  threshold: number = 0.001  // 0.1% - very strict for same-browser comparison
): Promise<RegressionResult> {
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const current = PNG.sync.read(fs.readFileSync(currentPath));
  
  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  
  const mismatchPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }  // Color sensitivity
  );
  
  const totalPixels = width * height;
  const mismatchPercentage = (mismatchPixels / totalPixels) * 100;
  
  const pass = mismatchPercentage <= threshold;
  
  if (!pass) {
    fs.writeFileSync(diffOutputPath, PNG.sync.write(diff));
  }
  
  return {
    pass,
    mismatchPixels,
    mismatchPercentage,
    diffImagePath: pass ? undefined : diffOutputPath,
  };
}
```

### Integration with Vitest/Jest

```typescript
// Input.visual.test.ts
import { describe, it, expect } from 'vitest';
import { runRegressionTest, captureStoryScreenshot } from '../lib/visual-testing';

describe('Input - Visual Regression', () => {
  const variants = [
    { name: 'Size-Regular-State-Default', storyId: 'obra-input--default' },
    { name: 'Size-Large-State-Default', storyId: 'obra-input--size-large' },
    { name: 'Size-Regular-State-Error', storyId: 'obra-input--state-error' },
  ];
  
  for (const variant of variants) {
    it(`matches baseline: ${variant.name}`, async () => {
      // Capture current
      const currentPath = await captureStoryScreenshot(variant.storyId);
      
      // Compare to baseline
      const result = await runRegressionTest(
        `__baselines__/${variant.name}.png`,
        currentPath,
        `__diff__/${variant.name}-diff.png`
      );
      
      expect(result.pass, 
        `Visual regression: ${result.mismatchPercentage.toFixed(3)}% mismatch`
      ).toBe(true);
    });
  }
});
```

### CI Integration

```yaml
# .github/workflows/visual-tests.yml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: npm ci
        
      - name: Build Storybook
        run: npm run build-storybook
        
      - name: Start Storybook
        run: npx http-server storybook-static -p 6006 &
        
      - name: Run visual regression tests
        run: npm run test:visual
        
      - name: Upload diff artifacts on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diff-report
          path: |
            **/__diff__/*.png
            **/visual-report.html
```

---

## File Structure Summary

```
components/obra/Input/
├── Input.tsx
├── Input.stories.tsx
├── Input.visual.test.ts            # Regression tests
├── .figma-manifest.json            # Component → Figma mapping
│
├── __figma_snapshots__/            # Downloaded from Figma (gitignored or LFS)
│   ├── Size-Mini-State-Default.png
│   ├── Size-Regular-State-Default.png
│   └── ...
│
├── __storybook_snapshots__/        # Current Storybook captures (gitignored)
│   └── ...
│
├── __baselines__/                  # Approved baselines (committed)
│   ├── Size-Mini-State-Default.png
│   ├── Size-Regular-State-Default.png
│   └── ...
│
└── __diff__/                       # Generated diffs (gitignored)
    ├── Size-Regular-State-Default-diff.png
    └── composite.png
```

---

## Commands Summary

```bash
# One-time setup: Download Figma images
npm run figma:download-snapshots -- --component=Input

# Initial validation: Compare Figma vs Storybook with AI
npm run visual:validate -- --component=Input

# Update baselines after validation passes
npm run visual:update-baselines -- --component=Input

# CI/daily: Fast regression test against baselines
npm run visual:test

# Re-validate after Figma changes
npm run visual:revalidate -- --component=Input
```

---

## Open Questions

1. **Token storage**: Where to store FIGMA_TOKEN? (env var, secrets manager)

2. **Baseline storage**: Git (simple), Git LFS (for large images), or external (S3)?

3. **AI model**: Claude with vision? GPT-4V? Local model?

4. **CI runner**: GitHub Actions? Do we need special browser setup?

5. **Threshold tuning**: What's the right % for Phase 1 vs Phase 2?

6. **Variant discovery**: Manual manifest or auto-discover from Figma component sets?

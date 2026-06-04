#!/usr/bin/env node

/**
 * classify-variants.js
 * 
 * Deterministically classify variant axes by comparing DOM diff verdicts:
 * - IDENTICAL/TEXT_ONLY across an axis → Behavioral (exclude)
 * - STYLE_ONLY/STRUCTURE_DIFFERENT → Visual (VARIANT type)
 * - Boolean axes → Component Property (BOOLEAN type)
 * 
 * Outputs figma-variants.json
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = {
  'variants-md': null,
  'variant-diffs': null,
  'capture-manifest': null,
  'output': null
};

process.argv.slice(2).forEach((arg) => {
  if (arg.startsWith('--')) {
    const key = arg.replace('--', '');
    const idx = process.argv.indexOf(arg);
    if (idx + 1 < process.argv.length) {
      args[key] = process.argv[idx + 1];
    }
  }
});

// Validate required arguments
const required = ['variants-md', 'variant-diffs', 'capture-manifest', 'output'];
for (const key of required) {
  if (!args[key]) {
    console.error(`Missing required argument: --${key}`);
    process.exit(1);
  }
}

// Read files
const variantsText = fs.readFileSync(args['variants-md'], 'utf-8');
const diffText = fs.readFileSync(args['variant-diffs'], 'utf-8');
const manifest = JSON.parse(fs.readFileSync(args['capture-manifest'], 'utf-8'));

// Parse variants.md to extract variant axes and component properties
function parseVariantsMd(text) {
  const lines = text.split('\n');
  
  const axes = [];
  const properties = [];
  let inAxesSection = false;
  let inPropertiesSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('Variant Axes (Dependent)')) {
      inAxesSection = true;
      inPropertiesSection = false;
      i += 2; // Skip header row
      continue;
    }
    
    if (line.includes('Component Properties (Independent)')) {
      inAxesSection = false;
      inPropertiesSection = true;
      i += 2; // Skip header row
      continue;
    }
    
    if (line.includes('Slots') || line.includes('Variant Combinations')) {
      inAxesSection = false;
      inPropertiesSection = false;
      continue;
    }
    
    if (inAxesSection && line.startsWith('|') && !line.includes('---')) {
      const parts = line.split('|').slice(1, -1).map(s => s.trim());
      if (parts.length >= 4) {
        axes.push({
          axis: parts[0],
          values: parts[1].split(',').map(v => v.trim()),
          source: parts[2],
          independence: parts[3]
        });
      }
    }
    
    if (inPropertiesSection && line.startsWith('|') && !line.includes('---')) {
      const parts = line.split('|').slice(1, -1).map(s => s.trim());
      if (parts.length >= 4) {
        properties.push({
          property: parts[0],
          figmaType: parts[1],
          default: parts[2],
          controlledNode: parts[3]
        });
      }
    }
  }
  
  return { axes, properties };
}

// Parse variant diffs to extract verdicts
function parseVariantDiffs(text) {
  const lines = text.split('\n');
  
  const verdictMatrix = {};
  const pairs = [];
  
  let inVerdictSection = false;
  let inPairDetails = false;
  let currentPairName = null;
  let currentPairVerdict = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('Verdict Matrix')) {
      inVerdictSection = true;
      i += 2; // Skip header
      continue;
    }
    
    if (line.includes('Pair Details')) {
      inVerdictSection = false;
      inPairDetails = true;
      continue;
    }
    
    if (inVerdictSection && line.startsWith('|')) {
      const parts = line.split('|').map(s => s.trim());
      if (parts[1] && parts[1] !== '—' && !parts[1].includes('V')) {
        // Store verdict matrix entries
        const v1 = parts[1];
        for (let j = 2; j < parts.length - 1; j++) {
          if (parts[j] && parts[j] !== '—') {
            const verdict = parts[j];
            verdictMatrix[`${v1},${j - 2}`] = verdict;
          }
        }
      }
    }
    
    // Parse pair details
    if (line.startsWith('### ') && line.includes(' vs ')) {
      const match = line.match(/### (.+) vs (.+)$/);
      if (match) {
        currentPairName = `${match[1]} vs ${match[2]}`;
      }
    }
    
    if (line.includes('**Verdict**:')) {
      const match = line.match(/\*\*Verdict\*\*:\s*(.+)$/);
      if (match) {
        currentPairVerdict = match[1].trim();
        if (currentPairName && currentPairVerdict) {
          pairs.push({
            name: currentPairName,
            verdict: currentPairVerdict
          });
        }
      }
    }
  }
  
  return { verdictMatrix, pairs };
}

// Build figma-variants.json
function buildFigmaVariants() {
  const { axes, properties } = parseVariantsMd(variantsText);
  const { pairs } = parseVariantDiffs(diffText);
  
  // Debug logging
  process.stderr.write(`DEBUG: Found ${axes.length} axes\n`);
  axes.forEach(a => {
    process.stderr.write(`  - ${a.axis}: ${a.values.join(', ')}\n`);
  });
  process.stderr.write(`DEBUG: Found ${pairs.length} pairs\n`);
  
  // Extract component name from manifest
  const componentName = manifest.component;
  
  // Map captured variants to variant combinations
  const capturedVariants = manifest.captured.map(c => c.variant);
  
  // Create variant folder map
  const variantFolderMap = {};
  
  // Determine axis classifications based on verdicts
  const variantAxes = [];
  
  // For each axis, check if there are visual differences
  for (const axis of axes) {
    process.stderr.write(`\nDEBUG: Processing axis: ${axis.axis}\n`);
    // Find pairs where the variants differ along this axis
    const axisRelatedPairs = pairs.filter(p => {
      const names = p.name.split(' vs ');
      const v1 = names[0].trim();
      const v2 = names[1].trim();
      
      // Check if this pair represents a difference along this axis
      // by seeing if one value from the axis appears in each variant name (case-insensitive)
      for (const value of axis.values) {
        const v1Lower = v1.toLowerCase();
        const v2Lower = v2.toLowerCase();
        const valueLower = value.toLowerCase();
        
        if (v1Lower.includes(valueLower) && !v2Lower.includes(valueLower)) return true;
        if (v2Lower.includes(valueLower) && !v1Lower.includes(valueLower)) return true;
      }
      return false;
    });
    
    process.stderr.write(`  Related pairs: ${axisRelatedPairs.length}\n`);
    axisRelatedPairs.forEach(p => {
      process.stderr.write(`    - ${p.verdict}\n`);
    });
    
    // If any pair shows STRUCTURE_DIFFERENT or STYLE_ONLY, it's a VARIANT
    const hasVisualDifference = axisRelatedPairs.some(p => 
      p.verdict === 'STRUCTURE_DIFFERENT' || p.verdict === 'STYLE_ONLY'
    );
    
    process.stderr.write(`  Has visual difference: ${hasVisualDifference}\n`);
    
    // Otherwise, if all pairs are IDENTICAL or TEXT_ONLY, it's Behavioral
    const allIdentical = axisRelatedPairs.length > 0 && 
      axisRelatedPairs.every(p => 
        p.verdict === 'IDENTICAL' || p.verdict === 'TEXT_ONLY'
      );
    
    if (hasVisualDifference) {
      variantAxes.push({
        axis: axis.axis,
        type: 'VARIANT',
        values: axis.values,
        default: axis.values[0],
        reactSource: axis.source
      });
      
      // Map variant folder names for this axis
      capturedVariants.forEach(variantName => {
        for (const value of axis.values) {
          const valueLower = value.toLowerCase();
          const variantLower = variantName.toLowerCase();
          if (variantLower.includes(valueLower)) {
            const axisLabel = `${axis.axis}=${value}`;
            variantFolderMap[axisLabel] = `variants/${variantName}`;
          }
        }
      });
    }
  }
  
  // Build visual groups from captured variants
  const visualGroups = capturedVariants.map((variantName, idx) => ({
    group: String.fromCharCode(65 + idx),  // A, B, C, D
    variants: [variantName],
    verdict: 'UNIQUE'
  }));
  
  // Build behavioral props (props that don't create visual differences)
  const behavioralProps = [];
  
  // Create output JSON
  const output = {
    componentName,
    variantAxes,
    componentProperties: properties.map(p => ({
      property: p.property,
      figmaType: p.figmaType,
      default: p.default,
      controlledNode: p.controlledNode
    })),
    variantFolderMap,
    behavioralProps,
    visualGroups,
    metadata: {
      variantsAnalyzed: capturedVariants.length,
      pairsCompared: pairs.length,
      timestamp: new Date().toISOString()
    }
  };
  
  return output;
}

// Main
try {
  const result = buildFigmaVariants();
  fs.writeFileSync(args.output, JSON.stringify(result, null, 2));
  console.log(`Written to ${args.output}`);
  console.log(`Variant axes: ${result.variantAxes.length}`);
  console.log(`Component properties: ${result.componentProperties.length}`);
  console.log(`Behavioral props: ${result.behavioralProps.length}`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

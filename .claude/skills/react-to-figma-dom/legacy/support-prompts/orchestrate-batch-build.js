#!/usr/bin/env node
/**
 * Automated Batch Build Orchestrator
 * 
 * This script coordinates building and verifying all preprocessed components.
 * It uses Node.js to manage the workflow since the actual Figma operations
 * would need to be done via subagents (which can't be automated in Node).
 * 
 * USAGE:
 *   node scripts/orchestrate-batch-build.js --file-key K185dncc0RbBmFGFxA1iyY
 * 
 * This generates:
 *   .temp/react-to-figma/build-commands.sh - Shell script with build instructions
 *   .temp/react-to-figma/build-scoreboard.md - Results summary
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PIPELINE_DIR = '.temp/react-to-figma';
const RESULTS_FILE = '.temp/react-to-figma/batch-preprocess-results.json';
const SKILL_DIR = '.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/2-implement-in-figma';

// Parse command line args
const fileKeyArg = process.argv.find(arg => arg.startsWith('--file-key='));
const FILE_KEY = fileKeyArg ? fileKeyArg.split('=')[1] : 'K185dncc0RbBmFGFxA1iyY';

// Load preprocessed components
let data;
try {
  data = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
} catch (e) {
  console.error(`ERROR: Could not load ${RESULTS_FILE}`);
  process.exit(1);
}

const readyComponents = data.components.filter(c => c.readyForFigma);

console.log(`\n📦 Batch Build Orchestrator`);
console.log(`\n   Components ready: ${readyComponents.length}`);
console.log(`   Figma file key: ${FILE_KEY}`);
console.log(`   Mode: First 2 variants per component\n`);

/**
 * Main verification flow
 * This runs the verify script for all built components
 */
function verifyAllBuiltComponents() {
  console.log('\n🔍 Verifying all built components...\n');
  
  const scorecard = {
    timestamp: new Date().toISOString(),
    totalComponents: readyComponents.length,
    results: [],
    summary: {
      total: 0,
      pass: 0,
      partial: 0,
      fail: 0,
      buildNotFound: 0,
      avgMatch: 0
    }
  };
  
  let totalMatch = 0;
  let verifiedCount = 0;
  
  readyComponents.forEach((comp, idx) => {
    const componentNum = idx + 1;
    const resultPath = path.join(comp.componentDir, 'figma-result.json');
    
    // Check if component was built
    if (!fs.existsSync(resultPath)) {
      scorecard.results.push({
        componentName: comp.componentName,
        status: 'notBuilt',
        totalVariants: comp.buildScriptCount
      });
      scorecard.summary.buildNotFound++;
      console.log(`[${componentNum}/${readyComponents.length}] ${comp.componentName.padEnd(30)} ⚠ NOT BUILT`);
      return;
    }
    
    // Component was built, now verify
    console.log(`[${componentNum}/${readyComponents.length}] ${comp.componentName.padEnd(30)} `, { noNewline: true });
    process.stdout.write('verifying... ');
    
    try {
      const verifyCmd = `source .env && node "${SKILL_DIR}/scripts/batch-screenshot-and-verify.js" --component-dir "${comp.componentDir}" --file-key "${FILE_KEY}"`;
      const output = execSync(verifyCmd, { encoding: 'utf8', cwd: process.cwd() });
      
      // Parse results
      const verifyFile = path.join(comp.componentDir, 'verification-results.json');
      let verdict = 'UNKNOWN';
      let avgMatch = 0;
      
      if (fs.existsSync(verifyFile)) {
        const verifyData = JSON.parse(fs.readFileSync(verifyFile, 'utf8'));
        verdict = verifyData.overallVerdict || 'UNKNOWN';
        avgMatch = verifyData.avgMatchPct || 0;
        
        scorecard.results.push({
          componentName: comp.componentName,
          status: 'verified',
          verdict,
          avgMatch,
          totalVariants: comp.buildScriptCount
        });
        
        // Track in summary
        scorecard.summary.total++;
        totalMatch += avgMatch;
        verifiedCount++;
        
        if (verdict === 'PASS') {
          scorecard.summary.pass++;
          console.log(`✅ PASS (${avgMatch.toFixed(1)}%)`);
        } else if (verdict === 'PARTIAL') {
          scorecard.summary.partial++;
          console.log(`⚠️  PARTIAL (${avgMatch.toFixed(1)}%)`);
        } else {
          scorecard.summary.fail++;
          console.log(`❌ FAIL (${avgMatch.toFixed(1)}%)`);
        }
      } else {
        console.log(`❌ FAIL (no verify results)`);
        scorecard.results.push({
          componentName: comp.componentName,
          status: 'verifyFailed',
          totalVariants: comp.buildScriptCount
        });
        scorecard.summary.fail++;
      }
    } catch (e) {
      console.log(`❌ ERROR: ${e.message}`);
      scorecard.results.push({
        componentName: comp.componentName,
        status: 'error',
        error: e.message,
        totalVariants: comp.buildScriptCount
      });
      scorecard.summary.fail++;
    }
  });
  
  // Calculate average match
  if (verifiedCount > 0) {
    scorecard.summary.avgMatch = (totalMatch / verifiedCount).toFixed(1);
  }
  
  return scorecard;
}

/**
 * Generate markdown scoreboard
 */
function generateScoreboard(scorecard) {
  let md = `# Batch Build & Verification Scoreboard\n\n`;
  md += `**Generated:** ${scorecard.timestamp}\n`;
  md += `**File Key:** \`${FILE_KEY}\`\n`;
  md += `**Mode:** First 2 variants per component\n\n`;
  
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Components | ${scorecard.summary.total} |\n`;
  md += `| ✅ Pass | ${scorecard.summary.pass} |\n`;
  md += `| ⚠️ Partial | ${scorecard.summary.partial} |\n`;
  md += `| ❌ Fail | ${scorecard.summary.fail} |\n`;
  md += `| Not Built | ${scorecard.summary.buildNotFound} |\n`;
  md += `| Avg Match % | ${scorecard.summary.avgMatch}% |\n\n`;
  
  md += `## Results\n\n`;
  md += `| Component | Status | Verdict | Avg Match% | Total Variants |\n`;
  md += `|-----------|--------|---------|------------|----------------|\n`;
  
  scorecard.results.forEach(r => {
    const status = r.status === 'verified' ? '✓' : r.status === 'notBuilt' ? '⚠' : '✗';
    const verdict = r.verdict || '—';
    const match = r.avgMatch ? `${r.avgMatch.toFixed(1)}%` : '—';
    md += `| ${r.componentName} | ${status} | ${verdict} | ${match} | ${r.totalVariants} |\n`;
  });
  
  return md;
}

// Main execution
try {
  // Run verification if components exist
  console.log(`\n${'='.repeat(80)}`);
  
  // First, print instructions for building
  console.log(`\n📋 NEXT STEPS:\n`);
  console.log(`This script coordinates verification of components that have been built.`);
  console.log(`To build all components, you need to spawn build subagents for each one.\n`);
  console.log(`For demonstration, we'll verify any components already built.\n`);
  
  const scorecard = verifyAllBuiltComponents();
  
  // Save scoreboard
  const scoreBoardFile = path.join(PIPELINE_DIR, 'verification-scoreboard.md');
  const scoreboardMd = generateScoreboard(scorecard);
  fs.writeFileSync(scoreBoardFile, scoreboardMd);
  
  // Save JSON results
  const resultFile = path.join(PIPELINE_DIR, 'verification-results.json');
  fs.writeFileSync(resultFile, JSON.stringify(scorecard, null, 2));
  
  // Print summary
  console.log(`\n${'='.repeat(80)}`);
  console.log(`\n📊 VERIFICATION SUMMARY`);
  console.log(`\n   Total Verified: ${scorecard.summary.total} / ${readyComponents.length}`);
  console.log(`   ✅ Pass:        ${scorecard.summary.pass}`);
  console.log(`   ⚠️  Partial:    ${scorecard.summary.partial}`);
  console.log(`   ❌ Fail:        ${scorecard.summary.fail}`);
  console.log(`   🔨 Not Built:   ${scorecard.summary.buildNotFound}`);
  console.log(`   Avg Match:     ${scorecard.summary.avgMatch}%\n`);
  
  console.log(`📄 Scoreboard: ${scoreBoardFile}`);
  console.log(`\n${'='.repeat(80)}\n`);
  
} catch (e) {
  console.error('\n❌ ERROR:', e.message);
  process.exit(1);
}

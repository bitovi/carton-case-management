/**
 * Keyword-based evaluation of an LLM-generated description file.
 *
 * Given a markdown description (produced by the screenshot-comparison skill's
 * "describe differences" step) and a comma-separated list of expected keywords,
 * checks whether the description mentions at least one keyword. Outputs a JSON
 * report of found/missing keywords and exits 0 (pass) or 1 (fail).
 *
 * Usage: node evaluate-describe.js <description.md> --keywords "kw1,kw2,kw3"
 */

const fs   = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let filePath = null;
let keywords = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--keywords' && i + 1 < args.length) {
    keywords = args[i + 1].split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    i++;
  } else if (!filePath) {
    filePath = args[i];
  }
}

if (!filePath || keywords.length === 0) {
  console.error('Usage: node evaluate-describe.js <description.md> --keywords "kw1,kw2,kw3"');
  process.exit(2);
}

try {
  const content = fs.readFileSync(path.resolve(filePath), 'utf-8').toLowerCase();
  const found = keywords.filter(kw => content.includes(kw));
  const missing = keywords.filter(kw => !content.includes(kw));
  const pass = found.length > 0;

  const result = { found, missing, pass };
  console.log(JSON.stringify(result, null, 2));
  process.exit(pass ? 0 : 1);
} catch (err) {
  console.error(`Error reading ${filePath}: ${err.message}`);
  process.exit(2);
}

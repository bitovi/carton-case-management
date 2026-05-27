#!/usr/bin/env node

/**
 * classify-variants.js
 *
 * Deterministic variant axis classification.
 * Reads variants.md (axis definitions) and variant-diffs.md (pair comparisons)
 * to produce figma-variants.json with each axis classified as:
 *   - VARIANT (visual — becomes Figma variant axis)
 *   - BOOLEAN (independent toggle — becomes Figma component property)
 *   - BEHAVIORAL (excluded — no visual difference)
 *   - NEEDS_REVIEW (ambiguous — requires AI screenshot analysis)
 *
 * Usage:
 *   node classify-variants.js \
 *     --variants-md .temp/react-to-figma/components/Badge/variants.md \
 *     --variant-diffs .temp/react-to-figma/components/Badge/variant-diffs.md \
 *     --capture-manifest .temp/react-to-figma/components/Badge/variants/capture-manifest.json \
 *     --output .temp/react-to-figma/components/Badge/figma-variants.json
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const variantsMdPath = getArg("variants-md");
const variantDiffsPath = getArg("variant-diffs");
const captureManifestPath = getArg("capture-manifest");
const outputPath = getArg("output");

if (!variantsMdPath || !variantDiffsPath || !outputPath) {
  console.error(
    "Usage: node classify-variants.js --variants-md <path> --variant-diffs <path> --capture-manifest <path> --output <path>"
  );
  process.exit(1);
}

const variantsMd = fs.readFileSync(variantsMdPath, "utf8");
const variantDiffs = fs.readFileSync(variantDiffsPath, "utf8");

let captureManifest = { captured: [], failed: [] };
if (captureManifestPath && fs.existsSync(captureManifestPath)) {
  captureManifest = JSON.parse(fs.readFileSync(captureManifestPath, "utf8"));
}

const failedVariants = new Set(
  (captureManifest.failed || []).map((f) => f.name || f)
);

function parseAxes(md) {
  const axes = [];
  const axisRegex =
    /\|\s*(\w+)\s*\|\s*([^|]+)\s*\|\s*([^|]*)\s*\|\s*([^|]*)\s*\|/g;
  let match;
  let headerSkipped = false;

  for (const line of md.split("\n")) {
    if (line.includes("---")) {
      headerSkipped = true;
      continue;
    }
    if (!headerSkipped) continue;

    match = axisRegex.exec(line);
    if (match) {
      const axis = match[1].trim();
      const values = match[2]
        .trim()
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const defaultVal = match[3].trim() || values[0];
      const reactSource = match[4].trim();

      if (axis && values.length > 0) {
        axes.push({ axis, values, default: defaultVal, reactSource });
      }
    }
    axisRegex.lastIndex = 0;
  }

  return axes;
}

function parseVariantFolders(md) {
  const folders = {};
  const folderRegex = /variants\/(\S+)/g;
  let match;
  while ((match = folderRegex.exec(md))) {
    folders[match[1]] = `variants/${match[1]}`;
  }
  return folders;
}

function parseVisualGroups(diffsMd) {
  const groups = [];
  const groupRegex =
    /Group\s+([A-Z])\s*[:\-–]\s*\[([^\]]+)\]\s*[:\-–]\s*(\w+)/gi;
  let match;
  while ((match = groupRegex.exec(diffsMd))) {
    groups.push({
      group: match[1],
      variants: match[2].split(",").map((v) => v.trim()),
      verdict: match[3].trim().toUpperCase(),
    });
  }
  return groups;
}

function parsePairVerdicts(diffsMd) {
  const pairs = [];
  const pairRegex = /(\S+)\s+vs\s+(\S+)\s*[:\-–]\s*(\w+)/gi;
  let match;
  while ((match = pairRegex.exec(diffsMd))) {
    pairs.push({
      a: match[1].trim(),
      b: match[2].trim(),
      verdict: match[3].trim().toUpperCase(),
    });
  }
  return pairs;
}

function classifyAxis(axis, pairs, allVariantNames) {
  const axisVariants = allVariantNames.filter((name) => {
    const lower = name.toLowerCase();
    return axis.values.some(
      (val) =>
        lower.includes(axis.axis.toLowerCase() + val.toLowerCase()) ||
        lower.includes(val.toLowerCase())
    );
  });

  if (axisVariants.length <= 1) {
    return "BEHAVIORAL";
  }

  const axisPairs = pairs.filter(
    (p) => axisVariants.includes(p.a) && axisVariants.includes(p.b)
  );

  if (axisPairs.length === 0) {
    return "NEEDS_REVIEW";
  }

  const allIdenticalOrText = axisPairs.every(
    (p) => p.verdict === "IDENTICAL" || p.verdict === "TEXT_ONLY"
  );

  if (allIdenticalOrText) {
    return "BEHAVIORAL";
  }

  const hasStructural = axisPairs.some(
    (p) =>
      p.verdict === "STRUCTURE_DIFFERENT" ||
      p.verdict === "STYLE_ONLY" ||
      p.verdict === "DIFFERENT"
  );

  if (hasStructural) {
    if (axis.values.length === 2) {
      const booleanValues = axis.values.map((v) => v.toLowerCase());
      const isBooleanLike =
        booleanValues.includes("true") ||
        booleanValues.includes("false") ||
        booleanValues.includes("yes") ||
        booleanValues.includes("no") ||
        booleanValues.includes("show") ||
        booleanValues.includes("hide");
      if (isBooleanLike) {
        return "BOOLEAN";
      }
    }
    return "VARIANT";
  }

  return "NEEDS_REVIEW";
}

const axes = parseAxes(variantsMd);
const visualGroups = parseVisualGroups(variantDiffs);
const pairs = parsePairVerdicts(variantDiffs);
const variantFolders = parseVariantFolders(variantsMd);

const allVariantNames = Object.keys(variantFolders).filter(
  (name) => !failedVariants.has(name)
);

const componentName =
  path.basename(path.dirname(outputPath)) ||
  path.basename(variantsMdPath).replace(/\.md$/, "");

const variantAxes = [];
const componentProperties = [];
const behavioralProps = [];
let hasNeedsReview = false;

for (const axis of axes) {
  const classification = classifyAxis(axis, pairs, allVariantNames);

  if (classification === "VARIANT") {
    variantAxes.push({
      axis: axis.axis,
      type: "VARIANT",
      values: axis.values,
      default: axis.default,
      reactSource: axis.reactSource,
    });
  } else if (classification === "BOOLEAN") {
    componentProperties.push({
      property: `Show ${axis.axis.toLowerCase()}`,
      figmaType: "BOOLEAN",
      default: false,
      controlledNode: `${axis.axis.toLowerCase()} frame`,
      reactSource: axis.reactSource,
    });
  } else if (classification === "BEHAVIORAL") {
    behavioralProps.push({
      prop: axis.axis,
      reason: "No visual difference across variants",
    });
  } else if (classification === "NEEDS_REVIEW") {
    hasNeedsReview = true;
    variantAxes.push({
      axis: axis.axis,
      type: "VARIANT",
      classification: "NEEDS_REVIEW",
      values: axis.values,
      default: axis.default,
      reactSource: axis.reactSource,
    });
  }
}

const variantFolderMap = {};
for (const [folderName, folderPath] of Object.entries(variantFolders)) {
  if (failedVariants.has(folderName)) continue;

  const axisValues = [];
  for (const va of variantAxes) {
    for (const val of va.values) {
      if (folderName.toLowerCase().includes(val.toLowerCase())) {
        axisValues.push(`${va.axis}=${val}`);
        break;
      }
    }
  }
  if (axisValues.length > 0) {
    variantFolderMap[axisValues.join(",")] = folderPath;
  }
}

const output = {
  componentName,
  variantAxes,
  componentProperties,
  variantFolderMap,
  behavioralProps,
  visualGroups,
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Wrote ${outputPath}`);
console.log(
  `  VARIANT axes: ${variantAxes.filter((a) => !a.classification).length}`
);
console.log(`  BOOLEAN properties: ${componentProperties.length}`);
console.log(`  Behavioral (excluded): ${behavioralProps.length}`);
console.log(
  `  NEEDS_REVIEW: ${variantAxes.filter((a) => a.classification === "NEEDS_REVIEW").length}`
);

if (hasNeedsReview) {
  console.log(
    "  ⚠ Some axes need AI review — run classify-state-enablers prompt"
  );
}

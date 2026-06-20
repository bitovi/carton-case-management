#!/usr/bin/env node

/**
 * classify-variants.js
 *
 * Transforms code-variants.json → figma-variants.json.
 *
 * Input:  code-variants.json (from Phase 6 — code-level analysis with independence classification)
 * Output: figma-variants.json (Figma-specific mapping consumed by Phase 8 build)
 *
 * The transform is deterministic:
 *   - axes with independent=false → variantAxes (type: VARIANT)
 *   - slots with independent=true → componentProperties (BOOLEAN/INSTANCE_SWAP/TEXT)
 *   - combinations.dependent → variantFolderMap
 *
 * Usage:
 *   node classify-variants.js \
 *     --code-variants .temp/react-to-figma-dom/components/Input/code-variants.json \
 *     --output .temp/react-to-figma-dom/components/Input/figma-variants.json
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const codeVariantsPath = getArg("code-variants");
const outputPath = getArg("output");

if (!outputPath) {
  console.error("Error: --output is required");
  process.exit(1);
}

if (codeVariantsPath && fs.existsSync(codeVariantsPath)) {
  transformFromJson(codeVariantsPath, outputPath);
} else {
  const componentDir = path.dirname(outputPath);
  const autoCodeVariants = path.join(componentDir, "code-variants.json");
  if (fs.existsSync(autoCodeVariants)) {
    transformFromJson(autoCodeVariants, outputPath);
  } else {
    console.error(
      "Error: Provide --code-variants <path> (code-variants.json not found)"
    );
    process.exit(1);
  }
}

function transformFromJson(inputPath, outputPath) {
  const codeVariants = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const componentName = codeVariants.componentName || path.basename(path.dirname(outputPath));

  const variantAxes = [];
  const componentProperties = [];
  const behavioralProps = [];

  for (const axis of codeVariants.axes || []) {
    if (axis.independent === false) {
      variantAxes.push({
        axis: axis.name,
        type: "VARIANT",
        values: axis.values,
        default: axis.default || axis.values[0],
        reactSource: axis.source,
      });
    } else if (axis.independent === true) {
      componentProperties.push({
        property: `Show ${axis.name.toLowerCase()}`,
        figmaType: axis.figmaType || "BOOLEAN",
        default: false,
        controlledNode: axis.controlledNode || `${axis.name.toLowerCase()} frame`,
        reactSource: axis.source,
        referenceCapture: axis.referenceCapture || null,
      });
    } else {
      behavioralProps.push({
        prop: axis.name,
        reason: axis.excludeReason || "Excluded from Figma variants",
      });
    }
  }

  for (const slot of codeVariants.slots || []) {
    if (slot.independent) {
      componentProperties.push({
        property: `Show ${slot.name.replace(/([A-Z])/g, " $1").trim().toLowerCase()}`,
        figmaType: slot.figmaType || "BOOLEAN",
        default: false,
        controlledNode: slot.controlledNode || `${slot.name} wrapper`,
        referenceCapture: slot.referenceCapture || null,
      });
    }
  }

  const variantFolderMap = {};
  for (const folderName of codeVariants.combinations?.dependent || []) {
    const axisValues = [];
    for (const va of variantAxes) {
      for (const val of va.values) {
        const pattern = `${va.axis} ${val}`.toLowerCase();
        if (folderName.toLowerCase().includes(pattern)) {
          axisValues.push(`${va.axis}=${val}`);
          break;
        }
      }
    }
    if (axisValues.length > 0) {
      variantFolderMap[axisValues.join(",")] = `variants/${folderName}`;
    }
  }

  const output = {
    componentName,
    variantAxes,
    componentProperties,
    variantFolderMap,
    behavioralProps,
    visualGroups: [],
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`Wrote ${outputPath} (from code-variants.json)`);
  console.log(`  VARIANT axes: ${variantAxes.length}`);
  console.log(`  Component properties: ${componentProperties.length}`);
  console.log(`  Behavioral (excluded): ${behavioralProps.length}`);
}

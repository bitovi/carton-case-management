#!/bin/bash
set -e

BADGE_DIR=".temp/react-to-figma/components/Badge"
BUILD_DIR="$BADGE_DIR/build"

# Generate the mega script header
cat > "$BADGE_DIR/mega-script.js" << 'HEADER'
// Badge Component Orchestration - Build all variants and combine
const parentFrameId = '3:4';
const parentFrame = figma.getNodeById(parentFrameId);
if (!parentFrame) throw new Error('Parent frame not found: ' + parentFrameId);

const allComponentIds = {};
const allMetadata = {};

function parseVariantName(name) {
  const m = name.match(/Variant(\w+)Roundness(\w+)State(\w+)/);
  return m ? {
    Variant: m[1], Roundness: m[2], State: m[3],
    isCore: !name.includes('WithIcon')
  } : null;
}

HEADER

# Get all build scripts and add them to the mega script
count=0
for script in $(ls "$BUILD_DIR"/*.build-script.js | sed 's|.*/||;s|.build-script.js||' | sort); do
  count=$((count+1))
  variant_name="$script"
  
  # Add try-catch wrapper
  cat >> "$BADGE_DIR/mega-script.js" << SCRIPT

// Variant $count: $variant_name
try {
SCRIPT
  
  # Read the build scri  # Read the build scri  #tatement
  grep -v "^return " "$BUILD_DIR/$script.build-script.js" >> "$BADGE_DIR/mega-script.js"
  
  # Add the tracking code
  cat >> "$BADGE_DIR/mega-script.js" << SCRIPT
  allComponentIds['$variant_name'] = root.id;
  const meta = parseVariantName('$variant_name');
  if (meta) allMetadata['$variant_name'] = meta;
} catch(e) {
  console.error('Failed $variant_name: ' + e.message);
}
SCRIPT
done

# Add the combining logic
cat >> "$BADGE_DIR/mega-script.js" << 'FOOTER'

// Combine core variants into component set
const coreIds = Object.entries(allComponentIds)
  .filter(([name]) => !name.includes('WithIcon'))
  .map(([name, id]) =>  .map(([name, id]) =>  .map(([nabject.keys(allComponentIds).len  .map(([name, id]) =>  .map(([name, id]) =>  .map(([nabject.keys(allComponentIgth);

if (coreIds.length > 1) {
  const coreComponents = coreIds.map(id => figma.getNodeById(i  const coreComponents = coreIdame each component to its variant string
  for (const [name, id] of Object.entries(allComponentIds)) {
    if (!name.includes('WithIcon')) {
      const comp = figma.getNodeById(id);
      if (comp) {
        const meta = allMetadata[name];
        if (meta) {
          comp.name = `${meta.Variant}=${meta.Variant}, ${meta.Roundness}=${meta.Roundness}, ${meta.State}=${meta.State}`;
        }
      }
    }
  }
  
  // Combine
  const componentList = coreComponents.map(c => c);
  const componentSet = figma.combineAsVariants(componentList, p  const componentSet = figma.ame = 'Badge';
  
  // Layout
  const SPACING = 40;
  const cols = Math.ceil(Math.sqrt(componentSet.children.length));
  componentSet.layoutMode = 'HORIZONTAL';
  componentSet.layoutWrap = 'WRAP';
  componentSet.itemSpacing = SPACING;
  componentSet.counterAxisSpacing = SPACING;
  componentSet.paddingTop = SPACING;
  componentSet.paddingBottom = SPACING;
  componentSet.paddingLeft = SPACING;
  componentSet.paddingRight = SPACING;
  componentSet.primaryAxisSizingMode = 'FIXED';
  componentSet.counterAxisSizingMode = 'AUTO';
  
  return {
    status: 'success',
    componentSetId: compone    componentSetmponentSetName: 'Badge',
    variantsCreated    variantsCrth
  };
}

return { status: 'completed', comporeturn { status: 'completed', comporeturn { status: 'completed', comporeturn { status: 'completed', com-script.js"
wc -l "$BADGE_DIR/mega-script.js"

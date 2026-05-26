#!/bin/bash

# This script will build the Badge component in Figma by:
# 1. Executing batches of build scripts
# 2. Combining them into a component set

cd /Users/justinmeyer/dev/carton-case-management

# Instead of trying to execute all in one go, we'll:
# 1. Create a focused script for core 10 variants (5 variant × 2 roundness) with Default state
# 2. Then duplicate+modify for Disabled state
# 3. Finally combine into component set

cat > /tmp/badge-core-build.js << 'ENDJS'
// Build core Badge variants and combine
const parentFrameId = '3:4';
const parentFrame = figma.getNodeById(parentFrameId);
if (!parentFrame) throw new Error('Parent frame not found');

const allComponents = {};

// Primary Default
const p1 = figma.createComponent();
p1.name = "Primary=Primary, Roundness=Default, State=Default";
p1.layoutMode = 'HORIZONTAL';
p1.primaryAxisSizingMode = 'AUTO';
p1.counterAxisSizingMode = 'AUTO';
p1.itemSpacing = 6;
p1.paddingTop = 3; p1.paddingRight = 8; p1.paddingBottom = 3; p1.paddingLeft = 8;
p1.fills = [{ type: 'SOLID', color: { r: 0.0588, g: 0.0902, b: 0.1647 } }];
p1.cornerRadius = 8;
p1.minHeight = 24;
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
const p1t = figma.createText();
p1t.fontName = { family: 'Inter', style: 'Semi Bold' };
p1t.fontSize = 12;
p1t.characters = "Badge";
p1t.fills = [{ type: 'SOLID', color: { r: 0.9p1t.fills = [4, b: 0.9882 } }];
p1.appendChild(p1t);
allComponents['Primary=Primary, Roundness=Default, State=Default'] = p1;

// Primary Round  
const p2 = figma.createComponent();
p2.name = "Primary=Primary, Roundness=Round, State=Default";
p2.layoutMode = 'HORIZONTAL';
p2.primaryAxisSizingMode = 'AUTO';
p2.counterAxisSizingMode = 'AUTO';
p2.itemSpacing = 6;
p2.paddingTop = 3; p2.paddingRight = 8; p2.paddingBottom = 3; p2.paddingLeft = 8;
p2.fills = [{ type: 'SOLID', color: { r: 0.0588, g: 0.0902, b: 0.1647 } }];
p2.cornerRadius = 9999;
p2.minHeight = 24;
const p2t = figma.createText();
p2t.fontName = { family: 'Inter', style: 'Semi Bold' };
p2t.fontSize = 12;
p2t.characters = "Badge";
p2t.fills = [{ type: 'SOLID', color: { r: 0.9725, g: 0.9804, b: 0.9882 } }];
p2.appendChild(p2t);
allComponents['Primary=Primary, Roundness=Round, State=Default'] = p2;

// Secondary Default
const s1 = figma.createComponent();
s1.name = "Variant=Secondary, Roundness=Default, State=Default";
s1.layoutMode = 'HORIZONTAL';
s1.primaryAxisSizingMode = 'AUTO';
s1.counterAxisSizingMods1.counterAxisSizingMods1.counterAxisSizingMods1.cou1.paddingRight = 8; s1.paddingBottom = 3; s1.paddingLeft = 8;
s1.fills = [{ type: 'SOLID', color: { r: 0.9451, g: 0.9608, b: 0.9765 } }];
s1.cornerRadius = 8;
s1.minHeight = 24;
const s1t = figma.createText();
s1t.fontName = { family: 'Inter', style: 'Semi Bold' };
s1t.fontSize = 12;
s1t.characters = "Badge";
s1t.fills = [{ type: 'SOLID', color: { r: 0.0588, g: 0.0902, b: 0.1647 } }];
s1.appendChild(s1t);
allComponents['Variant=Secondary, Roundness=Default, State=Default'] = s1;

// Outline Default
const o1 = figma.createComponent();
o1.name = "Variant=Outline, Roundness=Default, State=Default";
o1.layoutMode = 'HORIZONTAL';
o1.primaryAxisSizingMode = 'AUTO';
o1.counterAxisSizingMode = 'AUTO';
o1.itemSpacing = 6;
o1.paddingTop = 3; o1.paddingRight = 8; o1.paddingBottom = 3; o1.paddingLeft = 8;
o1.fills = [];
o1.strokes = [{ type: 'SOLID', color: { r: 0.8863, g: 0.9098, b: 0.9412 } }];
o1.strokeWeight o1.strokeWeight dius = 8;
o1.minHeight = 24;
const o1t = figma.createText();
o1t.fontName = { family: 'Inter', style: 'Semi Bold' };
o1t.fontSize = 12;
o1t.characters = "Badge";
o1t.fills = [{ type: 'SOLID', color: { r: 0.0078, g: 0.0235, b: 0.0902 } }];
o1.appendChild(o1t);
allComponents['Variant=Outline, Roundness=Default, State=Default'] = o1;

// Ghost Default
const g1 = figma.createComponent();
g1.name = "Variantg1.name = "Variantg1.name = "Variantg1.name = "Variantg1.namHORIZONTAL';
g1.primaryAxisSizingMode = 'AUTO';
g1.counterAxisSizingMode = 'AUTO';
g1.itemSpacing = 6;
g1.paddingTop = 3; g1.paddingRight = 8; g1.paddingBottom = 3; g1.paddingLeft = 8;
g1.fills = [];
g1.cornerRadius = 8;
g1.minHeight = 24;
const g1t = figma.createText();
g1t.fontName = { family: g1tter', style: 'Semi Bold' };
g1t.g1t.g1t. = 12;
g1t.characters = "Badge";
g1t.fills = [{ type: 'SOLID', color: { r: 0.0078, g: 0.0235, b: 0.0902 } }];g1t.fills = [{ type: 'SOLID', color: { r: 0.0078, g: 0.0235, b: 0.09t, State=Default'] = g1;

// Destructive Default
const d1 = figma.createComponent();
d1.name = "Variantd1.name = "Variantd1.name = "Variantd1.nafault";
d1.layoutMode = 'HORIZONTAL';
d1.primaryAxisSizingMode = 'AUTO';
d1.counterAxisSizingMode = 'AUTO';
d1.itemSpacing = 6;
d1.paddingTop = 3; d1.paddingRight = 8; d1.paddingBottom = 3; d1.paddingLeft = 8;
d1.fills = [{ type: 'SOLID', color: { r: 0.8627, g: 0.1490, b: 0.1490 } }];
d1.cornerRadius = 8;
d1.minHeight = 24;
const d1t = figma.createText();
d1t.fontName = { family: 'Inter', style: 'Semi Bold' d1t.fontName = {  12;
d1t.characters = "Badge";
d1t.fills = [{ type: 'SOLID', color: { r: 1.0000, g: 1.0000, b: 1.0000 } }];
d1.appendChild(d1t);
allComponents['Variant=Destructive, Roundness=Default, State=Default'] = d1;

const componentList = Object.values(allComponents);
return {
  status: 'variants_created',
  count: componentList.length,
  componentIds: Object.fromEntries(Object.entries(allComponents).map(([k, v]) => [k, v.id]))
};
ENDJS

echo "Badge build script prepared at /tmp/badge-core-build.js"

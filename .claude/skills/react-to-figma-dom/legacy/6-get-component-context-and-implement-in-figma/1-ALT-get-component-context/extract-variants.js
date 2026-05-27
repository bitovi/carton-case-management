#!/usr/bin/env node

/**
 * extract-variants.js
 *
 * Statically extracts variant axes from React component source files using
 * ts-morph AST analysis. Handles three patterns:
 *
 *   1. CVA definitions — parses cva() calls to extract variant axes, values,
 *      defaults, and compound variants.
 *   2. TypeScript union prop types — parses interface/type declarations to
 *      find union-typed props that control visual appearance.
 *   3. Boolean appearance props — detects boolean props like `error`,
 *      `disabled` that affect styling.
 *
 * Components without any extractable variants get a single "Default" variant.
 *
 * Usage:
 *   node extract-variants.js \
 *     --build-order .temp/react-to-figma/component-hierarchy/build-order.md \
 *     --src-root packages/client/src/components \
 *     --output .temp/react-to-figma/extracted-variants.json
 *
 *   # Or for a single component:
 *   node extract-variants.js \
 *     --component Button \
 *     --source packages/client/src/components/obra/Button/Button.tsx \
 *     --output .temp/react-to-figma/extracted-variants.json
 *
 * Output: JSON map of componentName → { source, cvaVariants[], propVariants[], combinations, matrix }
 */

const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    buildOrder: null,
    srcRoot: null,
    component: null,
    source: null,
    output: null,
    tsconfig: null,
  };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--build-order': opts.buildOrder = args[++i]; break;
      case '--src-root': opts.srcRoot = args[++i]; break;
      case '--component': opts.component = args[++i]; break;
      case '--source': opts.source = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
      case '--tsconfig': opts.tsconfig = args[++i]; break;
      default: break;
    }
  }
  return opts;
}

function parseBuildOrder(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const components = [];
  const seen = new Set();

  const sections = content.split(/^---$/m);
  for (const section of sections) {
    const headerMatch = section.match(/^\|\s*Component\s*\|\s*Type\s*\|\s*(Source|Depends On)/m);
    if (!headerMatch) continue;
    const hasSource = headerMatch[1] === 'Source';

    const tableRowRe = /^\|\s*(?:✅\s*)?(\w+)\s*\|\s*(\S+)\s*\|\s*(.+?)\s*\|/gm;
    let match;
    while ((match = tableRowRe.exec(section)) !== null) {
      const name = match[1];
      if (name === 'Component') continue;
      if (seen.has(name)) continue;
      seen.add(name);
      components.push({
        name,
        type: match[2],
        sourcePath: hasSource ? match[3].trim() : null,
        dependsOn: hasSource ? null : match[3].trim(),
      });
    }
  }
  return components;
}

function findComponentFile(srcRoot, componentName) {
  const searchDirs = [srcRoot];
  const visited = new Set();
  while (searchDirs.length > 0) {
    const dir = searchDirs.shift();
    if (visited.has(dir)) continue;
    visited.add(dir);
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      if (ent.name.startsWith('.') || ent.name === 'node_modules') continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        searchDirs.push(full);
      } else if (ent.name === `${componentName}.tsx`) {
        return full;
      }
    }
  }
  return null;
}

function resolveSourceFile(srcRoot, sourcePath, componentName) {
  const folderName = path.basename(sourcePath);
  const candidates = [
    path.join(srcRoot, sourcePath, `${componentName}.tsx`),
    path.join(srcRoot, sourcePath, `${componentName}/${componentName}.tsx`),
    path.join(srcRoot, sourcePath, `${folderName}.tsx`),
    path.join(srcRoot, sourcePath, 'index.tsx'),
    path.join(srcRoot, sourcePath + '.tsx'),
    path.join(srcRoot, `${sourcePath}.tsx`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  const fullDir = path.join(srcRoot, sourcePath);
  if (fs.existsSync(fullDir) && fs.statSync(fullDir).isDirectory()) {
    const tsxFiles = fs.readdirSync(fullDir).filter(f => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.stories.'));
    if (tsxFiles.length === 1) {
      return path.join(fullDir, tsxFiles[0]);
    }
    for (const f of tsxFiles) {
      if (f === `${componentName}.tsx` || f === `${folderName}.tsx`) {
        return path.join(fullDir, f);
      }
    }
    const mainFile = tsxFiles.find(f => !f.startsWith('index'));
    if (mainFile) return path.join(fullDir, mainFile);
  }

  return null;
}

function extractCvaVariants(sourceFile) {
  const results = [];
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

  for (const call of callExpressions) {
    const expr = call.getExpression();
    if (expr.getText() !== 'cva') continue;

    const callArgs = call.getArguments();
    if (callArgs.length < 2) continue;

    const configArg = callArgs[1];
    if (configArg.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;

    const cvaName = findCvaVariableName(call);
    const configObj = configArg;

    const variantsProperty = configObj.getProperty('variants');
    const defaultsProperty = configObj.getProperty('defaultVariants');
    const compoundProperty = configObj.getProperty('compoundVariants');

    if (!variantsProperty) continue;

    const variantsInit = variantsProperty.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (!variantsInit) continue;

    const axes = {};
    for (const axisProp of variantsInit.getProperties()) {
      if (axisProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
      const axisName = axisProp.getName();
      const axisInit = axisProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (!axisInit) continue;

      const values = [];
      for (const valueProp of axisInit.getProperties()) {
        if (valueProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
        let valueName = valueProp.getName();
        valueName = valueName.replace(/^['"]|['"]$/g, '');
        if (valueName === 'true') valueName = true;
        else if (valueName === 'false') valueName = false;
        values.push(valueName);
      }
      axes[axisName] = { values, default: null };
    }

    if (defaultsProperty) {
      const defaultsInit = defaultsProperty.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (defaultsInit) {
        for (const defProp of defaultsInit.getProperties()) {
          if (defProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
          const name = defProp.getName();
          if (axes[name]) {
            let defaultVal = defProp.getInitializer().getText();
            defaultVal = defaultVal.replace(/^['"]|['"]$/g, '');
            if (defaultVal === 'true') defaultVal = true;
            else if (defaultVal === 'false') defaultVal = false;
            axes[name].default = defaultVal;
          }
        }
      }
    }

    let compoundVariants = [];
    if (compoundProperty) {
      const compoundInit = compoundProperty.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (compoundInit) {
        for (const element of compoundInit.getElements()) {
          if (element.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
          const compound = {};
          for (const prop of element.getProperties()) {
            if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
            const propName = prop.getName();
            if (propName === 'class' || propName === 'className') continue;
            let val = prop.getInitializer().getText();
            val = val.replace(/^['"]|['"]$/g, '');
            compound[propName] = val;
          }
          if (Object.keys(compound).length > 0) {
            compoundVariants.push(compound);
          }
        }
      }
    }

    results.push({
      name: cvaName,
      axes,
      compoundVariants,
    });
  }

  return results;
}

function findCvaVariableName(callExpr) {
  let parent = callExpr.getParent();
  while (parent) {
    if (parent.getKind() === SyntaxKind.VariableDeclaration) {
      return parent.getName();
    }
    parent = parent.getParent();
  }
  return null;
}

function extractPropInterfaces(sourceFile, componentName) {
  const results = [];
  const targetNames = [
    `${componentName}Props`,
    `${componentName}RootProps`,
    `${componentName}TriggerProps`,
    `${componentName}ContentProps`,
    `${componentName}ItemProps`,
  ];

  for (const iface of sourceFile.getInterfaces()) {
    const ifaceName = iface.getName();
    if (!ifaceName.includes('Props')) continue;
    const propAxes = {};
    const booleanProps = [];
    const slotProps = [];

    for (const member of iface.getProperties()) {
      const memberName = member.getName();
      const typeNode = member.getTypeNode();
      if (!typeNode) continue;

      const typeText = typeNode.getText();

      if (typeNode.getKind() === SyntaxKind.UnionType) {
        const unionValues = extractUnionLiterals(typeNode);
        if (unionValues.length > 1 && isVisualProp(memberName)) {
          propAxes[memberName] = {
            values: unionValues,
            default: null,
            optional: member.hasQuestionToken(),
          };
        }
      } else if (typeText === 'boolean' && isVisualBoolProp(memberName)) {
        booleanProps.push({
          name: memberName,
          optional: member.hasQuestionToken(),
        });
      } else if (typeText.includes('ReactNode') || typeText.includes('React.ReactNode')) {
        slotProps.push({
          name: memberName,
          optional: member.hasQuestionToken(),
        });
      }
    }

    if (Object.keys(propAxes).length > 0 || booleanProps.length > 0 || slotProps.length > 0) {
      results.push({
        interfaceName: ifaceName,
        axes: propAxes,
        booleanProps,
        slotProps,
      });
    }
  }

  for (const typeAlias of sourceFile.getTypeAliases()) {
    const typeName = typeAlias.getName();
    if (!typeName.includes('Props')) continue;

    const typeNode = typeAlias.getTypeNode();
    if (!typeNode) continue;

    const propAxes = {};
    const booleanProps = [];
    const slotProps = [];

    const typeLiterals = typeNode.getDescendantsOfKind(SyntaxKind.TypeLiteral);
    for (const typeLit of typeLiterals) {
      for (const member of typeLit.getProperties()) {
        const memberName = member.getName();
        const memberTypeNode = member.getTypeNode();
        if (!memberTypeNode) continue;

        const typeText = memberTypeNode.getText();

        if (memberTypeNode.getKind() === SyntaxKind.UnionType) {
          const unionValues = extractUnionLiterals(memberTypeNode);
          if (unionValues.length > 1 && isVisualProp(memberName)) {
            propAxes[memberName] = {
              values: unionValues,
              default: null,
              optional: member.hasQuestionToken(),
            };
          }
        } else if (typeText === 'boolean' && isVisualBoolProp(memberName)) {
          booleanProps.push({ name: memberName, optional: member.hasQuestionToken() });
        }
      }
    }

    if (Object.keys(propAxes).length > 0 || booleanProps.length > 0) {
      results.push({
        interfaceName: typeName,
        axes: propAxes,
        booleanProps,
        slotProps,
      });
    }
  }

  return results;
}

function extractUnionLiterals(unionTypeNode) {
  const values = [];
  for (const typeNode of unionTypeNode.getTypeNodes()) {
    if (typeNode.getKind() === SyntaxKind.LiteralType) {
      const literal = typeNode.getLiteral();
      if (literal.getKind() === SyntaxKind.StringLiteral) {
        values.push(literal.getLiteralValue());
      } else if (literal.getKind() === SyntaxKind.TrueKeyword) {
        values.push(true);
      } else if (literal.getKind() === SyntaxKind.FalseKeyword) {
        values.push(false);
      }
    }
  }
  return values;
}

const VISUAL_PROP_NAMES = new Set([
  'variant', 'size', 'roundness', 'shape', 'layout', 'type',
  'color', 'intent', 'status', 'severity', 'spacing', 'orientation',
  'align', 'position', 'side',
]);

const VISUAL_BOOL_PROP_NAMES = new Set([
  'error', 'disabled', 'loading', 'active', 'selected', 'checked',
  'indeterminate', 'open', 'expanded', 'indented',
]);

function isVisualProp(name) {
  return VISUAL_PROP_NAMES.has(name);
}

function isVisualBoolProp(name) {
  return VISUAL_BOOL_PROP_NAMES.has(name);
}

function mergeAxes(cvaResults, propResults, componentName) {
  const axes = {};
  const booleanProps = [];
  const slotProps = [];

  let primaryCva = cvaResults;
  if (cvaResults.length > 1) {
    const compLower = componentName.toLowerCase();
    const nameMatches = cvaResults.filter((c) =>
      c.name && c.name.toLowerCase().includes(compLower + 'variant')
    );
    if (nameMatches.length === 0) {
      const triggerMatch = cvaResults.filter((c) =>
        c.name && c.name.toLowerCase().includes('trigger')
      );
      primaryCva = triggerMatch.length > 0 ? triggerMatch : [cvaResults[0]];
    } else {
      primaryCva = nameMatches;
    }
  }

  for (const cva of primaryCva) {
    for (const [axisName, axisData] of Object.entries(cva.axes)) {
      if (!axes[axisName]) {
        axes[axisName] = {
          values: axisData.values,
          default: axisData.default,
          source: 'cva',
          cvaName: cva.name,
        };
      }
    }
  }

  let primaryPropResults = propResults;
  if (propResults.length > 1) {
    const exactMatch = propResults.filter((p) => p.interfaceName === `${componentName}Props`);
    if (exactMatch.length > 0) {
      primaryPropResults = exactMatch;
    } else {
      const triggerMatch = propResults.filter((p) => p.interfaceName.includes('Trigger'));
      primaryPropResults = triggerMatch.length > 0 ? triggerMatch : [propResults[0]];
    }
  }

  for (const prop of primaryPropResults) {
    for (const [axisName, axisData] of Object.entries(prop.axes)) {
      if (!axes[axisName]) {
        axes[axisName] = {
          values: axisData.values,
          default: axisData.default,
          source: 'props',
          interfaceName: prop.interfaceName,
        };
      } else {
        const existing = axes[axisName];
        for (const v of axisData.values) {
          if (!existing.values.includes(v)) {
            existing.values.push(v);
          }
        }
      }
    }

    for (const bp of prop.booleanProps) {
      if (!booleanProps.some((b) => b.name === bp.name)) {
        booleanProps.push(bp);
      }
    }

    for (const sp of prop.slotProps) {
      if (!slotProps.some((s) => s.name === sp.name)) {
        slotProps.push(sp);
      }
    }
  }

  return { axes, booleanProps, slotProps };
}

function buildVariantMatrix(axes) {
  const axisNames = Object.keys(axes).filter((name) => {
    const vals = axes[name].values;
    return vals.length > 0 && !vals.every((v) => typeof v === 'boolean');
  });

  if (axisNames.length === 0) {
    return [{ name: 'Default', props: {} }];
  }

  const combos = [{}];
  for (const axisName of axisNames) {
    const values = axes[axisName].values;
    const newCombos = [];
    for (const combo of combos) {
      for (const value of values) {
        newCombos.push({ ...combo, [axisName]: value });
      }
    }
    combos.length = 0;
    combos.push(...newCombos);
  }

  return combos.map((combo) => {
    const nameParts = axisNames.map((axis) => {
      const val = combo[axis];
      const str = String(val);
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
    return {
      name: nameParts.join(''),
      props: combo,
    };
  });
}

function analyzeComponent(project, filePath, componentName) {
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) {
    return {
      component: componentName,
      source: filePath,
      error: `Source file not found: ${filePath}`,
      cvaDefinitions: [],
      propInterfaces: [],
      axes: {},
      booleanProps: [],
      slotProps: [],
      combinations: 0,
      matrix: [],
    };
  }

  const cvaResults = extractCvaVariants(sourceFile);
  const propResults = extractPropInterfaces(sourceFile, componentName);

  const typesFilePath = path.join(path.dirname(filePath), 'types.ts');
  const typesFile = project.getSourceFile(typesFilePath);
  if (typesFile) {
    const typesPropResults = extractPropInterfaces(typesFile, componentName);
    propResults.push(...typesPropResults);
  }
  const { axes, booleanProps, slotProps } = mergeAxes(cvaResults, propResults, componentName);
  const matrix = buildVariantMatrix(axes);

  const compoundVariants = cvaResults.flatMap((c) => c.compoundVariants);

  return {
    component: componentName,
    source: filePath,
    cvaDefinitions: cvaResults.map((c) => ({
      name: c.name,
      axisCount: Object.keys(c.axes).length,
      compoundCount: c.compoundVariants.length,
    })),
    propInterfaces: propResults.map((p) => ({
      name: p.interfaceName,
      axisCount: Object.keys(p.axes).length,
      booleanCount: p.booleanProps.length,
      slotCount: p.slotProps.length,
    })),
    axes,
    booleanProps,
    slotProps,
    compoundVariants: compoundVariants.length > 0 ? compoundVariants : undefined,
    combinations: matrix.length,
    matrix,
  };
}

function main() {
  const opts = parseArgs();

  if (!opts.output) {
    opts.output = '.temp/react-to-figma/extracted-variants.json';
  }

  const tsconfigPath = opts.tsconfig || path.resolve('packages/client/tsconfig.json');
  const project = new Project({
    tsConfigFilePath: fs.existsSync(tsconfigPath) ? tsconfigPath : undefined,
    skipAddingFilesFromTsConfig: true,
  });

  let components = [];

  if (opts.component && opts.source) {
    const absSource = path.resolve(opts.source);
    project.addSourceFileAtPath(absSource);
    components = [{ name: opts.component, resolvedPath: absSource }];
  } else if (opts.buildOrder) {
    const srcRoot = path.resolve(opts.srcRoot || 'packages/client/src/components');
    const entries = parseBuildOrder(opts.buildOrder);

    for (const entry of entries) {
      let resolved = null;

      if (entry.sourcePath) {
        resolved = resolveSourceFile(srcRoot, entry.sourcePath, entry.name);
      }

      if (!resolved) {
        resolved = findComponentFile(srcRoot, entry.name);
      }

      if (resolved) {
        try {
          project.addSourceFileAtPath(resolved);
          const typesFile = path.join(path.dirname(resolved), 'types.ts');
          if (fs.existsSync(typesFile)) {
            try { project.addSourceFileAtPath(typesFile); } catch (e) {}
          }
        } catch (e) {
          // skip
        }
        components.push({ name: entry.name, resolvedPath: resolved, type: entry.type, sourcePath: entry.sourcePath });
      } else {
        components.push({ name: entry.name, resolvedPath: null, type: entry.type, sourcePath: entry.sourcePath });
      }
    }
  } else {
    console.error('Either --build-order or --component + --source is required');
    process.exit(1);
  }

  const results = {};
  let totalComponents = 0;
  let withCva = 0;
  let withPropVariants = 0;
  let defaultOnly = 0;
  let errors = 0;

  for (const comp of components) {
    totalComponents++;

    if (!comp.resolvedPath) {
      results[comp.name] = {
        component: comp.name,
        source: comp.sourcePath || null,
        error: 'Source file not resolved',
        axes: {},
        booleanProps: [],
        slotProps: [],
        combinations: 1,
        matrix: [{ name: 'Default', props: {} }],
      };
      errors++;
      continue;
    }

    const result = analyzeComponent(project, comp.resolvedPath, comp.name);

    if (result.error) {
      errors++;
    } else if (result.cvaDefinitions.length > 0) {
      withCva++;
    } else if (Object.keys(result.axes).length > 0) {
      withPropVariants++;
    } else {
      defaultOnly++;
    }

    results[comp.name] = result;
  }

  fs.mkdirSync(path.dirname(path.resolve(opts.output)), { recursive: true });
  fs.writeFileSync(path.resolve(opts.output), JSON.stringify(results, null, 2));

  console.log(`\nVariant extraction complete`);
  console.log(`  Total components: ${totalComponents}`);
  console.log(`  With CVA:         ${withCva}`);
  console.log(`  With prop unions: ${withPropVariants}`);
  console.log(`  Default only:     ${defaultOnly}`);
  console.log(`  Errors:           ${errors}`);
  console.log(`\nOutput: ${opts.output}`);

  const topComponents = Object.values(results)
    .filter((r) => r.combinations > 1)
    .sort((a, b) => b.combinations - a.combinations)
    .slice(0, 10);

  if (topComponents.length > 0) {
    console.log(`\nTop components by variant count:`);
    for (const c of topComponents) {
      const axisNames = Object.keys(c.axes);
      const axisStr = axisNames.map((a) => `${a}(${c.axes[a].values.length})`).join(' × ');
      console.log(`  ${c.component}: ${c.combinations} combos [${axisStr}]`);
    }
  }
}

main();

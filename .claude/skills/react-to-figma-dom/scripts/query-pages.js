#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf('--' + name);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

const hasFlag = (name) => args.includes('--' + name);

const pagesJsonPath = getArg('pages-json');
const componentName = getArg('component');
const routesMode = hasFlag('routes');
const raw = hasFlag('raw');

if (!pagesJsonPath) {
  console.error('Usage:');
  console.error('  node query-pages.js --pages-json <path> --component <Name>');
  console.error('  node query-pages.js --pages-json <path> --routes [--raw]');
  process.exit(1);
}

if (!fs.existsSync(pagesJsonPath)) {
  console.error('ERROR: pages.json not found at ' + pagesJsonPath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));
const layoutComponents = data.layoutComponents || [];
const pages = data.pages || {};
const routes = Object.keys(pages).sort();

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const NUMERIC_ID_RE = /\/\d+(?=\/|$)/g;

function normalizeRoute(route) {
  return route
    .replace(UUID_RE, ':id')
    .replace(NUMERIC_ID_RE, '/:id');
}

function isMeaningfulProp(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'function') return false;
  if (value === '[Function]' || value === '[ReactElement]' || value === '[Ref]' || value === '[Symbol]') return false;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
  return true;
}

function formatPropValue(value) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.length > 0 ? '[...]' : '[]';
  if (typeof value === 'object' && value !== null) return '{...}';
  return '...';
}

function filterProps(props) {
  if (!props || typeof props !== 'object') return {};
  const result = {};
  for (const [k, v] of Object.entries(props)) {
    if (isMeaningfulProp(v)) result[k] = v;
  }
  return result;
}

function propsToString(props) {
  const filtered = filterProps(props);
  const entries = Object.entries(filtered);
  if (entries.length === 0) return '';
  return entries.map(([k, v]) => k + '=' + formatPropValue(v)).join(', ');
}

function findComponentInTree(node, targetName) {
  let results = [];
  if (node.name === targetName) {
    results.push({ props: node.props });
  }
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      results = results.concat(findComponentInTree(child, targetName));
    }
  }
  return results;
}

function propsSignature(props) {
  const filtered = filterProps(props);
  const keys = Object.keys(filtered).sort();
  return keys.map(k => k + '=' + formatPropValue(filtered[k])).join(', ');
}

if (routesMode) {
  if (raw) {
    for (const route of routes) console.log(route);
  } else {
    const normalized = new Map();
    for (const route of routes) {
      const norm = normalizeRoute(route);
      if (!normalized.has(norm)) normalized.set(norm, []);
      normalized.get(norm).push(route);
    }
    for (const [norm, rawRoutes] of normalized) {
      if (rawRoutes.length === 1 && rawRoutes[0] === norm) {
        console.log(norm);
      } else {
        console.log(norm + '  (' + rawRoutes.length + ' instances)');
      }
    }
  }
  process.exit(0);
}

if (!componentName) {
  console.error('ERROR: --component <Name> required when not using --routes');
  process.exit(1);
}

const routeHits = [];
for (const route of routes) {
  const tree = pages[route].tree;
  const instances = findComponentInTree(tree, componentName);
  if (instances.length > 0) {
    routeHits.push({ route, normalized: normalizeRoute(route), instances });
  }
}

if (routeHits.length === 0) {
  console.log('# ' + componentName + ' — App Usage');
  console.log('');
  console.log('Not found on any route.');
  process.exit(0);
}

const allInstances = routeHits.reduce((sum, h) => sum + h.instances.length, 0);
const uniqueRouteShapes = new Set(routeHits.map(h => h.normalized)).size;

console.log('# ' + componentName + ' — App Usage');
console.log('');
console.log('Found ' + allInstances + ' instances across ' + routeHits.length + ' routes (' + uniqueRouteShapes + ' unique route shapes).');
console.log('');

const signatureMap = new Map();
for (const hit of routeHits) {
  for (const instance of hit.instances) {
    const sig = propsSignature(instance.props);
    if (!signatureMap.has(sig)) signatureMap.set(sig, { props: filterProps(instance.props), routes: new Set() });
    signatureMap.get(sig).routes.add(hit.normalized);
  }
}

console.log('## Distinct prop combinations (' + signatureMap.size + ')');
console.log('');

let idx = 0;
for (const [sig, entry] of signatureMap) {
  idx++;
  const propStr = sig || '(no meaningful props)';
  const routeList = [...entry.routes].join(', ');
  console.log(idx + '. ' + propStr);
  console.log('   Routes: ' + routeList);
}

console.log('');
console.log('## Per-route details');

const byNormalized = new Map();
for (const hit of routeHits) {
  const norm = hit.normalized;
  if (!byNormalized.has(norm)) byNormalized.set(norm, []);
  byNormalized.get(norm).push(hit);
}

for (const [norm, hits] of byNormalized) {
  const totalInstances = hits.reduce((s, h) => s + h.instances.length, 0);
  console.log('');
  console.log('### ' + norm + ' (' + totalInstances + ' instances)');
  const seen = new Set();
  for (const hit of hits) {
    for (const instance of hit.instances) {
      const sig = propsSignature(instance.props);
      if (seen.has(sig)) continue;
      seen.add(sig);
      const propStr = propsToString(instance.props);
      console.log('- ' + componentName + (propStr ? ' — ' + propStr : ''));
    }
  }
}

export const meta = {
  name: 'figma-from-code',
  description: 'Rebuild Figma file from codebase — discover, tokenize, build components, assemble screens, validate',
  whenToUse: 'When the user wants to run the figma-from-code pipeline as a workflow with parallel execution and progress tracking',
  phases: [
    { title: 'Hydrate', detail: 'Load state from prior phases (when starting mid-pipeline)' },
    { title: 'Discovery', detail: 'Browser crawl + icon scan (parallel)' },
    { title: 'Normalize', detail: 'Align component names with Figma conventions' },
    { title: 'Setup', detail: 'Tokens + file structure (parallel)' },
    { title: 'Pre-capture', detail: 'Screenshot all components and screens' },
    { title: 'Build Icons', detail: 'Create icon/asset components from SVG' },
    { title: 'Build Components', detail: 'Sequential tier-by-tier component builds' },
    { title: 'Build Screens', detail: 'Compose screens from built components (parallel)' },
    { title: 'Validate', detail: 'Compare Figma vs app, fix mismatches' },
  ],
}

const SKILL = '.claude/skills/figma-from-code'
const TEMP = '.temp/figma-from-code'

const PHASE_ORDER = [
  'phase0a', 'phase0b', 'phase1', 'phase2', 'phase2_5', 'phase3', 'phase4', 'phase5'
]

const WAVE_MEMBERS = {
  wave1: ['phase0a', 'phase0b'],
  wave2: ['phase1', 'phase2'],
  wave3: ['phase2_5'],
  wave4: ['phase3'],
  wave5: ['phase4'],
  wave6: ['phase5'],
}

function shouldRunPhase(phaseId, startPhase, endPhase) {
  const idx = PHASE_ORDER.indexOf(phaseId)
  const startIdx = startPhase ? PHASE_ORDER.indexOf(startPhase) : 0
  const endIdx = endPhase ? PHASE_ORDER.indexOf(endPhase) : PHASE_ORDER.length - 1
  return idx >= startIdx && idx <= endIdx
}

function shouldRunWave(waveName, startPhase, endPhase) {
  return WAVE_MEMBERS[waveName].some(p => shouldRunPhase(p, startPhase, endPhase))
}

// --- Schemas ---

const HYDRATION_SCHEMA = {
  type: 'object',
  properties: {
    fileKey: { type: 'string' },
    tiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tier: { type: 'number' },
          label: { type: 'string' },
          components: { type: 'array', items: { type: 'string' } }
        },
        required: ['tier', 'label', 'components']
      }
    },
    builtComponents: { type: 'object', additionalProperties: { type: 'string' } },
    preExistingComponents: { type: 'object', additionalProperties: { type: 'string' } },
    preExistingScreens: { type: 'object', additionalProperties: { type: 'string' } },
    existingCollections: { type: 'array', items: { type: 'string' } },
    existingPages: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, id: { type: 'string' } },
        required: ['name', 'id']
      }
    },
    figmaNodes: { type: 'object', additionalProperties: { type: 'string' } },
    screens: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          screenName: { type: 'string' },
          route: { type: 'string' },
          pageSourceFile: { type: 'string' },
          keyComponents: { type: 'array', items: { type: 'string' } }
        },
        required: ['screenName', 'route']
      }
    }
  },
  required: ['fileKey', 'tiers', 'builtComponents', 'figmaNodes']
}

const DISCOVERY_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    componentCount: { type: 'number' },
    tierCount: { type: 'number' },
    tiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tier: { type: 'number' },
          label: { type: 'string' },
          components: { type: 'array', items: { type: 'string' } }
        },
        required: ['tier', 'label', 'components']
      }
    },
    builtComponents: { type: 'object', additionalProperties: { type: 'string' } },
    preExistingComponents: { type: 'object', additionalProperties: { type: 'string' } },
    preExistingScreens: { type: 'object', additionalProperties: { type: 'string' } },
    existingCollections: { type: 'array', items: { type: 'string' } },
    existingPages: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, id: { type: 'string' } },
        required: ['name', 'id']
      }
    }
  },
  required: ['success', 'tierCount', 'tiers']
}

const ASSETS_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    iconCount: { type: 'number' },
    assetCount: { type: 'number' },
    icons: { type: 'array', items: { type: 'string' } },
    assets: { type: 'array', items: { type: 'string' } }
  },
  required: ['success', 'iconCount']
}

const NORMALIZE_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    renameCount: { type: 'number' },
    updatedTiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tier: { type: 'number' },
          label: { type: 'string' },
          components: { type: 'array', items: { type: 'string' } }
        },
        required: ['tier', 'label', 'components']
      }
    }
  },
  required: ['success']
}

const TOKENS_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    variableCount: { type: 'number' },
    collections: { type: 'array', items: { type: 'string' } },
    variableMapPath: { type: 'string' }
  },
  required: ['success']
}

const STRUCTURE_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    foundationsPageId: { type: 'string' },
    componentsPageId: { type: 'string' },
    screensPageId: { type: 'string' },
    foundationsFrameId: { type: 'string' },
    iconsFrameId: { type: 'string' },
    screensFrameId: { type: 'string' }
  },
  required: ['success', 'componentsPageId', 'iconsFrameId', 'screensFrameId']
}

const PRECAPTURE_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    componentsCaptured: { type: 'number' },
    screensCaptured: { type: 'number' },
    skipped: { type: 'number' },
    failed: { type: 'number' },
    screens: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          screenName: { type: 'string' },
          route: { type: 'string' },
          pageSourceFile: { type: 'string' },
          keyComponents: { type: 'array', items: { type: 'string' } }
        },
        required: ['screenName', 'route']
      }
    }
  },
  required: ['success']
}

const PREAMBLE_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    created: { type: 'object', additionalProperties: { type: 'string' } },
    totalCreated: { type: 'number' },
    totalSkipped: { type: 'number' },
    totalFailed: { type: 'number' }
  },
  required: ['success', 'created']
}

const TIER_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    tier: { type: 'number' },
    tierFrameId: { type: 'string' },
    completed: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          nodeId: { type: 'string' },
          verdict: { type: 'string' },
          matchPct: { type: 'number' }
        },
        required: ['name']
      }
    },
    failed: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          error: { type: 'string' }
        },
        required: ['name']
      }
    }
  },
  required: ['success', 'tier', 'completed']
}

const SCREEN_SCHEMA = {
  type: 'object',
  properties: {
    screenName: { type: 'string' },
    status: { type: 'string', enum: ['built', 'rejected', 'needs_authorization', 'failed'] },
    nodeId: { type: 'string' },
    verdict: { type: 'string' },
    matchPct: { type: 'number' },
    missingComponents: { type: 'array', items: { type: 'string' } }
  },
  required: ['screenName', 'status']
}

const VALIDATION_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    componentsCompared: { type: 'number' },
    match: { type: 'number' },
    minorDiff: { type: 'number' },
    mismatch: { type: 'number' },
    noAppReference: { type: 'number' },
    fixedDuringValidation: { type: 'number' },
    averageMatchPct: { type: 'number' },
    overallVerdict: { type: 'string' },
    reportPath: { type: 'string' }
  },
  required: ['success', 'overallVerdict']
}

const STATE_UPDATE_SCHEMA = {
  type: 'object',
  properties: { success: { type: 'boolean' } },
  required: ['success']
}

// --- Args ---

const {
  fileKey,
  sourceDir = 'packages/client/src/',
  startPhase = null,
  endPhase = null
} = args || {}

if (!fileKey) {
  log('ERROR: fileKey is required. Pass it via args: { fileKey: "your-file-key" }')
  return { error: 'fileKey is required' }
}

const needsHydration = startPhase && startPhase !== 'phase0a'

// --- Mutable orchestration state ---

let tiers = []
let builtComponents = {}
let preExistingComponents = {}
let preExistingScreens = {}
let existingCollections = []
let existingPages = []
let figmaNodes = {}
let screens = []

// === STATE HYDRATION (when starting mid-pipeline) ===

if (needsHydration) {
  phase('Hydrate')
  log('Starting mid-pipeline — hydrating state from prior phases')

  const hydrated = await agent(
    [
      'Read the figma-from-code state files and return all orchestration data.',
      '',
      'Read these files from .temp/figma-from-code/:',
      '  - state.json (main state ledger)',
      '  - discovery-summary.json (build order and component counts)',
      '  - precapture-screens.json (screen list, if it exists)',
      '',
      'From state.json, extract and return:',
      '  - fileKey',
      '  - buildOrder.tiers as tiers',
      '  - builtComponents',
      '  - preExistingComponents',
      '  - preExistingScreens',
      '  - existingCollections',
      '  - existingPages',
      '  - figmaNodes',
      '',
      'From precapture-screens.json (if it exists), extract the screen list.',
      'Each screen needs: screenName, route, pageSourceFile, keyComponents.',
      'If precapture-screens.json does not exist, return screens as an empty array.',
      '',
      'If state.json does not exist, return { fileKey: "", tiers: [], builtComponents: {}, figmaNodes: {} }',
      'to signal that prior phases have not been run.',
    ].join('\n'),
    { label: 'hydrate-state', phase: 'Hydrate', schema: HYDRATION_SCHEMA }
  )

  if (!hydrated.fileKey || hydrated.tiers.length === 0) {
    log('ERROR: No state found. Run from phase0a first, or use the skill orchestrator.')
    return { error: 'No state.json found — cannot start from ' + startPhase }
  }

  tiers = hydrated.tiers
  builtComponents = hydrated.builtComponents || {}
  preExistingComponents = hydrated.preExistingComponents || {}
  preExistingScreens = hydrated.preExistingScreens || {}
  existingCollections = hydrated.existingCollections || []
  existingPages = hydrated.existingPages || []
  figmaNodes = hydrated.figmaNodes || {}
  screens = hydrated.screens || []

  log('Hydrated: ' + tiers.length + ' tiers, ' + Object.keys(builtComponents).length + ' built components, ' + Object.keys(figmaNodes).length + ' figma nodes')
}

// === WAVE 1: Discovery (parallel) ===

if (shouldRunWave('wave1', startPhase, endPhase)) {
  phase('Discovery')
  log('Wave 1: Discovering components and assets in parallel')

  const [discovery, assets] = await parallel([
    () => agent(
      [
        'Discover the complete component architecture by browser crawling the running dev server and static code scanning. Also inspect the Figma file for existing components, pages, and variable collections.',
        '',
        'Read and follow the skill instructions at: ' + SKILL + '/1-discovery-components/SKILL.md',
        'Figma file key: ' + fileKey,
        'Source directory: ' + sourceDir,
        '',
        'Write component-map.json and discovery-summary.json to ' + TEMP + '/',
        'Initialize state.json in ' + TEMP + '/ with the state ledger template from the orchestrator skill.',
        '',
        'Return: success, componentCount, tierCount, tiers (with tier/label/components), builtComponents, preExistingComponents, preExistingScreens, existingCollections, existingPages.',
      ].join('\n'),
      { label: 'discover-components', phase: 'Discovery', schema: DISCOVERY_SCHEMA }
    ),

    () => agent(
      [
        'Discover all Lucide icons and SVG assets imported across the codebase via static code analysis.',
        '',
        'Read and follow the skill instructions at: ' + SKILL + '/2-discovery-assets/SKILL.md',
        'Source directory: ' + sourceDir,
        '',
        'Write icons.json and icons-summary.json to ' + TEMP + '/',
        '',
        'Return: success, iconCount, assetCount, icons (list of icon names), assets (list of asset names).',
      ].join('\n'),
      { label: 'discover-assets', phase: 'Discovery', schema: ASSETS_SCHEMA }
    ),
  ])

  if (!discovery || !discovery.success) {
    log('ERROR: Component discovery failed')
    return { error: 'Phase 0a (component discovery) failed', details: discovery }
  }
  if (!assets || !assets.success) {
    log('ERROR: Asset discovery failed')
    return { error: 'Phase 0b (asset discovery) failed', details: assets }
  }

  tiers = discovery.tiers || []
  builtComponents = discovery.builtComponents || {}
  preExistingComponents = discovery.preExistingComponents || {}
  preExistingScreens = discovery.preExistingScreens || {}
  existingCollections = discovery.existingCollections || []
  existingPages = discovery.existingPages || []

  log('Discovered ' + (discovery.componentCount || 0) + ' components across ' + discovery.tierCount + ' tiers')
  log('Found ' + assets.iconCount + ' icons, ' + (assets.assetCount || 0) + ' assets')

  // --- Normalization (needs both 0a + 0b) ---
  phase('Normalize')
  log('Running component name normalization')

  const normResult = await agent(
    [
      'Run the component name normalization script to align scanner names with Figma conventions, then re-read the updated discovery-summary.json and return the refreshed build order.',
      '',
      'Run this command:',
      '  node ' + SKILL + '/1-discovery-components/normalize-component-map.js ' + TEMP + '/component-map.json ' + TEMP + '/icons.json --write',
      '',
      'After the script completes, read ' + TEMP + '/discovery-summary.json (it was regenerated by the script).',
      'Extract the updated tiers from the buildOrder field.',
      '',
      'Return: success, renameCount (from script stdout), updatedTiers (the refreshed tiers array).',
    ].join('\n'),
    { label: 'normalize', phase: 'Normalize', schema: NORMALIZE_SCHEMA }
  )

  if (normResult && normResult.updatedTiers && normResult.updatedTiers.length > 0) {
    tiers = normResult.updatedTiers
  }
  log('Normalization: ' + (normResult ? normResult.renameCount || 0 : 0) + ' components renamed')

  // Update state.json with discovery results
  await agent(
    [
      'Update ' + TEMP + '/state.json with Phase 0a + 0b results.',
      '',
      'Set these fields:',
      '  phases.phase0a: "complete"',
      '  phases.phase0b: "complete"',
      '  buildOrder: { tierCount: ' + tiers.length + ', tiers: ' + JSON.stringify(tiers) + ' }',
      '  builtComponents: ' + JSON.stringify(builtComponents),
      '  preExistingComponents: ' + JSON.stringify(preExistingComponents),
      '  preExistingScreens: ' + JSON.stringify(preExistingScreens),
      '  existingCollections: ' + JSON.stringify(existingCollections),
      '  existingPages: ' + JSON.stringify(existingPages),
      '',
      'Read the current state.json, merge these fields, and write it back.',
    ].join('\n'),
    { label: 'update-state-wave1', phase: 'Normalize', schema: STATE_UPDATE_SCHEMA }
  )
}

// === WAVE 2: Tokens + Structure (parallel) ===

if (shouldRunWave('wave2', startPhase, endPhase)) {
  phase('Setup')
  log('Wave 2: Setting up tokens and file structure in parallel')

  const [tokens, structure] = await parallel([
    () => agent(
      [
        'Create Figma variable collections (Palette, Semantic, Spacing) and extract the CSS-to-Figma variable map.',
        '',
        'Read and follow the skill instructions at: ' + SKILL + '/3-setup-tokens/SKILL.md',
        'Figma file key: ' + fileKey,
        'Existing collections (skip if already present): ' + JSON.stringify(existingCollections),
        '',
        'Write tokens-summary.json and variables.json to ' + TEMP + '/',
        'Update state.json: set phases.phase1 to "complete" and variableMapPath.',
        '',
        'Return: success, variableCount, collections (list of collection names), variableMapPath.',
      ].join('\n'),
      { label: 'setup-tokens', phase: 'Setup', schema: TOKENS_SCHEMA }
    ),

    () => agent(
      [
        'Create the Figma file page skeleton (Foundations, Components, Screens pages) and container frames (Icons frame, Screens frame).',
        '',
        'Read and follow the skill instructions at: ' + SKILL + '/4-setup-structure/SKILL.md',
        'Figma file key: ' + fileKey,
        'Existing pages (skip if already present): ' + JSON.stringify(existingPages),
        '',
        'Write structure-summary.json to ' + TEMP + '/',
        'Update state.json: set phases.phase2 to "complete" and all figmaNodes page/frame IDs.',
        '',
        'Return: success, foundationsPageId, componentsPageId, screensPageId, foundationsFrameId, iconsFrameId, screensFrameId.',
      ].join('\n'),
      { label: 'setup-structure', phase: 'Setup', schema: STRUCTURE_SCHEMA }
    ),
  ])

  if (!tokens || !tokens.success) {
    log('ERROR: Token setup failed')
    return { error: 'Phase 1 (tokens) failed', details: tokens }
  }
  if (!structure || !structure.success) {
    log('ERROR: File structure setup failed')
    return { error: 'Phase 2 (file structure) failed', details: structure }
  }

  figmaNodes = {
    ...figmaNodes,
    foundationsPageId: structure.foundationsPageId,
    componentsPageId: structure.componentsPageId,
    screensPageId: structure.screensPageId,
    foundationsFrameId: structure.foundationsFrameId,
    iconsFrameId: structure.iconsFrameId,
    screensFrameId: structure.screensFrameId,
  }

  log('Tokens: ' + (tokens.variableCount || 0) + ' variables in ' + (tokens.collections || []).join(', '))
  log('Structure: pages and frames created')
}

// === WAVE 3: Pre-capture ===

if (shouldRunWave('wave3', startPhase, endPhase)) {
  phase('Pre-capture')
  log('Wave 3: Capturing app screenshots for all components and screens')

  const precapture = await agent(
    [
      'Capture app screenshots and structured text content for all components and screens from the running dev server.',
      '',
      'Read and follow the skill instructions at: ' + SKILL + '/5-precapture/SKILL.md',
      'Figma file key: ' + fileKey,
      '',
      'Build manifests from ' + TEMP + '/component-map.json.',
      'Capture all screenshottable components and all discovered routes.',
      '',
      'Write precapture-all.json and precapture-screens.json to ' + TEMP + '/',
      'Update state.json: set phases.phase2_5 to "complete".',
      '',
      'IMPORTANT: Also return the list of captured screens with their metadata.',
      'For each screen, extract: screenName, route, pageSourceFile (from component-map.json routes/tree), keyComponents.',
      '',
      'Return: success, componentsCaptured, screensCaptured, skipped, failed, screens (array of screen objects).',
    ].join('\n'),
    { label: 'precapture', phase: 'Pre-capture', schema: PRECAPTURE_SCHEMA }
  )

  if (!precapture || !precapture.success) {
    log('ERROR: Pre-capture failed')
    return { error: 'Phase 2.5 (pre-capture) failed', details: precapture }
  }

  screens = precapture.screens || []
  log('Pre-captured ' + (precapture.componentsCaptured || 0) + ' components, ' + (precapture.screensCaptured || 0) + ' screens')
}

// === WAVE 4: Component Builds (sequential) ===

if (shouldRunWave('wave4', startPhase, endPhase)) {

  // --- Icon Preamble ---
  phase('Build Icons')
  log('Wave 4: Building icon and asset components')

  // Materialize builtComponents.json before preamble
  await agent(
    [
      'Write the current builtComponents registry to disk so Phase 3 agents can read it.',
      '',
      'Write this JSON to ' + TEMP + '/builtComponents.json:',
      JSON.stringify(builtComponents),
    ].join('\n'),
    { label: 'materialize-built', phase: 'Build Icons', schema: STATE_UPDATE_SCHEMA }
  )

  const preamble = await agent(
    [
      'Build all Figma icon and asset components from SVG data before tier processing.',
      '',
      'Read and follow the skill instructions at: ' + SKILL + '/6-build-tier/icon-preamble/SKILL.md',
      'Figma file key: ' + fileKey,
      'Icons frame node ID: ' + (figmaNodes.iconsFrameId || ''),
      '',
      'Read icons.json and builtComponents.json from ' + TEMP + '/',
      'Skip icons/assets already in builtComponents.json.',
      'Write icon-preamble-results.json to ' + TEMP + '/',
      'Update builtComponents.json with newly created icons.',
      '',
      'Return: success, created (map of name to nodeId), totalCreated, totalSkipped, totalFailed.',
    ].join('\n'),
    { label: 'icon-preamble', phase: 'Build Icons', schema: PREAMBLE_SCHEMA }
  )

  if (preamble && preamble.created) {
    builtComponents = { ...builtComponents, ...preamble.created }
  }
  log('Icons: ' + (preamble ? preamble.totalCreated || 0 : 0) + ' created, ' + (preamble ? preamble.totalSkipped || 0 : 0) + ' skipped')

  // --- Sequential Tier Builds ---
  for (let i = 0; i < tiers.length; i++) {
    const tierDef = tiers[i]
    phase('Build Components')
    log('Building Tier ' + tierDef.tier + ' (' + tierDef.label + '): ' + tierDef.components.length + ' components')

    const tierResult = await agent(
      [
        'Build all Figma components for Tier ' + tierDef.tier + ' (' + tierDef.label + '). Process components sequentially within the tier.',
        '',
        'Read and follow the skill instructions at: ' + SKILL + '/6-build-tier/SKILL.md',
        'Figma file key: ' + fileKey,
        '',
        'Tier: ' + tierDef.tier,
        'Tier label: ' + tierDef.label,
        'Components page ID: ' + (figmaNodes.componentsPageId || ''),
        'Components to build: ' + tierDef.components.join(', '),
        '',
        'Read builtComponents.json from ' + TEMP + '/ for already-built component lookup.',
        'Skip components already in builtComponents.json.',
        'For each component, execute the full 7-step build pipeline:',
        '  7a: analyze source, build via use_figma, capture screenshot',
        '  7b: compare against app screenshot, fix loop (up to 3 iterations)',
        '',
        'After building all components:',
        '  - Update builtComponents.json on disk with newly built components',
        '  - Write build-tier' + tierDef.tier + '.json to ' + TEMP + '/',
        '  - Update state.json: tierProgress.tier' + tierDef.tier + ' = "complete"',
        '',
        'Return: success, tier, tierFrameId, completed (array of {name, nodeId, verdict, matchPct}), failed (array of {name, error}).',
      ].join('\n'),
      { label: 'tier-' + tierDef.tier + '-' + tierDef.label, phase: 'Build Components', schema: TIER_SCHEMA }
    )

    if (tierResult) {
      for (const comp of (tierResult.completed || [])) {
        if (comp.nodeId) {
          builtComponents[comp.name] = comp.nodeId
        }
      }
      if (tierResult.tierFrameId) {
        figmaNodes['tier' + tierDef.tier + 'FrameId'] = tierResult.tierFrameId
      }
      const completedCount = (tierResult.completed || []).length
      const failedCount = (tierResult.failed || []).length
      log('Tier ' + tierDef.tier + ' complete: ' + completedCount + ' built, ' + failedCount + ' failed')
    }
  }

  // Update state with all Phase 3 results
  await agent(
    [
      'Update ' + TEMP + '/state.json with Phase 3 completion.',
      '',
      'Set these fields:',
      '  phases.phase3: "complete"',
      '  builtComponents: ' + JSON.stringify(builtComponents),
      '  figmaNodes: ' + JSON.stringify(figmaNodes),
      '',
      'Read the current state.json, merge these fields, and write it back.',
    ].join('\n'),
    { label: 'update-state-phase3', phase: 'Build Components', schema: STATE_UPDATE_SCHEMA }
  )

  log('Phase 3 complete: ' + Object.keys(builtComponents).length + ' total built components')
}

// === WAVE 5: Screen Builds (parallel) ===

if (shouldRunWave('wave5', startPhase, endPhase)) {
  phase('Build Screens')

  if (screens.length === 0) {
    log('No screens to build — skipping Wave 5')
  } else {
    log('Wave 5: Building ' + screens.length + ' screens in parallel')

    const screenResults = (await parallel(
      screens.map(function(screen) {
        return function() {
          return agent(
            [
              'Build a Figma screen frame by composing built component instances, then validate visually.',
              '',
              'Read and follow the skill instructions at: ' + SKILL + '/8-build-screens/SKILL.md',
              'Figma file key: ' + fileKey,
              '',
              'Screen name: ' + screen.screenName,
              'Route: ' + screen.route,
              'Page source file: ' + (screen.pageSourceFile || ''),
              'Screens frame node ID: ' + (figmaNodes.screensFrameId || ''),
              'App screenshot: ' + TEMP + '/screenshots/screens/' + screen.screenName + '/app.png',
              'Text content: ' + TEMP + '/screenshots/screens/' + screen.screenName + '/text.json',
              'Screenshot dir: ' + TEMP + '/screenshots/screens/' + screen.screenName + '/',
              'Key components: ' + (screen.keyComponents || []).join(', '),
              '',
              'Read builtComponents.json from ' + TEMP + '/ for component instance lookup.',
              'Pre-existing screens (DO NOT MODIFY without authorization): ' + JSON.stringify(preExistingScreens),
              '',
              'Follow all 7 steps: verify components, analyze source + screenshot, build via use_figma,',
              'screenshot, compare, fix loop (up to 3 iterations), write result.',
              '',
              'Write result to ' + TEMP + '/build-results/screens/' + screen.screenName + '.json',
              '',
              'Return: screenName, status (built/rejected/needs_authorization/failed), nodeId, verdict, matchPct, missingComponents.',
            ].join('\n'),
            { label: 'screen-' + screen.screenName, phase: 'Build Screens', schema: SCREEN_SCHEMA }
          )
        }
      })
    )).filter(Boolean)

    const builtScreens = screenResults.filter(function(s) { return s.status === 'built' })
    const failedScreens = screenResults.filter(function(s) { return s.status !== 'built' })

    log('Screens: ' + builtScreens.length + ' built, ' + failedScreens.length + ' failed/rejected')

    if (failedScreens.length > 0) {
      log('Failed screens: ' + failedScreens.map(function(s) { return s.screenName + ' (' + s.status + ')' }).join(', '))
    }

    // Update state
    await agent(
      [
        'Update ' + TEMP + '/state.json with Phase 4 completion.',
        '',
        'Set phases.phase4: "complete".',
        'Read the current state.json, merge this field, and write it back.',
      ].join('\n'),
      { label: 'update-state-phase4', phase: 'Build Screens', schema: STATE_UPDATE_SCHEMA }
    )
  }
}

// === WAVE 6: Validation ===

if (shouldRunWave('wave6', startPhase, endPhase)) {
  phase('Validate')
  log('Wave 6: Validating all built components against app screenshots')

  const validation = await agent(
    [
      'Validate every built Figma component against its app screenshot. Run fix loops on mismatches for components built during this run. Clean up the Components page layout.',
      '',
      'Read and follow the skill instructions at: ' + SKILL + '/9-validate/SKILL.md',
      'Figma file key: ' + fileKey,
      'Dev server URL: http://localhost:5173',
      '',
      'Inputs:',
      '  builtComponents: ' + JSON.stringify(builtComponents),
      '  preExistingComponents (validate read-only, no fix loop): ' + JSON.stringify(preExistingComponents),
      '  figmaNodes: ' + JSON.stringify(figmaNodes),
      '  buildOrder tierCount: ' + tiers.length,
      '',
      'Write validation-summary.json to ' + TEMP + '/',
      'Write full report to .temp/figma-validation/report.md',
      'Update state.json: set phases.phase5 to "complete".',
      'Stop the Playwright server if running.',
      '',
      'Return: success, componentsCompared, match, minorDiff, mismatch, noAppReference, fixedDuringValidation, averageMatchPct, overallVerdict, reportPath.',
    ].join('\n'),
    { label: 'validate', phase: 'Validate', schema: VALIDATION_SCHEMA }
  )

  if (validation) {
    log('Validation: ' + validation.overallVerdict)
    log('  Compared: ' + (validation.componentsCompared || 0) + ', Match: ' + (validation.match || 0) + ', Minor: ' + (validation.minorDiff || 0) + ', Mismatch: ' + (validation.mismatch || 0))
    if (validation.fixedDuringValidation > 0) {
      log('  Fixed during validation: ' + validation.fixedDuringValidation)
    }
  }
}

// === FINAL SUMMARY ===

const summary = {
  fileKey: fileKey,
  totalComponents: Object.keys(builtComponents).length,
  totalTiers: tiers.length,
  totalScreens: screens.length,
  figmaNodes: figmaNodes,
  phasesRun: {
    startPhase: startPhase || 'phase0a',
    endPhase: endPhase || 'phase5',
  },
}

log('Workflow complete: ' + summary.totalComponents + ' components, ' + summary.totalScreens + ' screens')

return summary

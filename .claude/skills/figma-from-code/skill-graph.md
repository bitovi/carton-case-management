# figma-from-code Skill Graph

Recursive set of all skills called (directly or transitively) by `figma-from-code`.

## Recursive tree

```
figma-from-code (orchestrator)
├── figma-from-code-discovery-components       (Phase 0a)
│   ├── site-component-map                     (provides map-components.js)
│   └── figma-component-dependency-map         (build-order reference)
│       └── figma:figma-generate-library       (plugin skill)
├── figma-from-code-discovery-assets           (Phase 0b)
├── figma-setup-variables                      (Phase 1)
│   ├── figma:figma-generate-library           (plugin)
│   └── figma:figma-use                        (plugin — for use_figma)
├── figma-setup-file-structure                 (Phase 2)
│   ├── figma:figma-generate-library           (plugin)
│   └── figma:figma-use                        (plugin)
├── figma-from-code-precapture                 (Phase 2.5)
│   └── site-component-map                     (script source)
├── figma-from-code-build-tier                 (Phase 3)
│   ├── figma-from-code-build-component        (per component)
│   │   └── screenshot-comparison              (pixel diff)
│   └── site-component-map                     (build-order reference)
├── figma-from-code-build-screens              (Phase 4)
│   └── site-component-map                     (route reference)
└── figma-from-code-validator                  (Phase 5 / standalone)
    ├── screenshot-comparison
    └── site-component-map                     (component app map)
```

## Flat deduplicated list (14 skills)

### Project-local (12)

1. `figma-from-code-discovery-components`
2. `figma-from-code-discovery-assets`
3. `figma-setup-variables`
4. `figma-setup-file-structure`
5. `figma-from-code-precapture`
6. `figma-from-code-build-tier`
7. `figma-from-code-build-component`
8. `figma-from-code-build-screens`
9. `figma-from-code-validator`
10. `figma-component-dependency-map`
11. `screenshot-comparison`
12. `site-component-map`

### Plugin skills (2)

13. `figma:figma-generate-library`
14. `figma:figma-use`

## Convergence points

Shared utility skills with the highest fan-in:

- `site-component-map` — pulled in by 5 skills (discovery-components, precapture, build-tier, build-screens, validator)
- `figma:figma-generate-library` — pulled in by 3 skills (component-dependency-map, setup-variables, setup-file-structure)
- `screenshot-comparison` — pulled in by 2 skills (build-component, validator)
- `figma:figma-use` — pulled in by 2 skills (setup-variables, setup-file-structure)

These are the load-bearing dependencies — changes here cascade widely.

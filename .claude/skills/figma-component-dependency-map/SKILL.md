---
name: figma-component-dependency-map
description: Scan the Carton React codebase and produce a topologically-sorted component build order. Run this before figma:figma-generate-library so Phase 3 (components) processes atoms before molecules.
---

# Skill: Component Dependency Map

Analyzes `packages/client/src/components/` and `packages/client/src/pages/` to produce a build order for `figma:figma-generate-library`. The library skill needs to know which components to build first — this skill answers that.

## When to Use

Before starting `figma:figma-generate-library` Phase 3, or when the component tree has changed significantly.

## What to Do

Run these bash commands and analyze the output:

```bash
# Find all component files (exclude tests and stories)
find packages/client/src/components -name "*.tsx" | grep -v ".test.\|.stories."
find packages/client/src/pages -name "*.tsx" | grep -v ".test.\|.stories."

# For each file, extract its custom component imports
grep -E "^import.*from.*@/components|^import.*from.*\.\./|^import.*from.*\./" <file>
```

## Tier Classification

- **Tier 1 — Atomic** (`obra/` components): No imports from other custom components. These are the Figma primitives. Build first.
- **Tier 2 — Composed** (`common/`, `inline-edit/`): Import from `obra/` or other composed components.
- **Tier 3 — Feature** (`CaseList`, `CaseDetails`, etc.): Import from Tier 1 and 2.
- **Tier 4 — Pages** (`pages/`): Import feature components. Build last.

## Current Build Order (as of 2026-05-04)

### Tier 1: Atomic (obra)
Button, Input, Badge, Textarea, Label, Skeleton, Checkbox, Select, Accordion, Dialog, AlertDialog, HoverCard, Popover, Card, Alert, Sheet, Tooltip, Calendar

### Tier 2: Composed (common + inline-edit)
CheckboxGroup → Checkbox  
RichCheckboxGroup → Checkbox  
DialogHeader → Button + DialogTitle + DialogDescription  
MoreOptionsMenu → Button + Popover  
VoterTooltip → HoverCard  
FiltersTrigger → Badge  
MultiSelect → Popover + Checkbox  
ConfirmationDialog → AlertDialog + Button  
RelationshipManagerList → Checkbox  
BaseEditable → (none)  
EditControls → Button  
EditableText/Currency/Number/Percent → Input + BaseEditable + EditControls  
EditableTextarea → Textarea + Button  
EditableTitle → Button + Input  
EditableDate → Calendar + BaseEditable  
EditableSelect → BaseEditable  

### Tier 3: Feature
FiltersList → Select + MultiSelect  
FiltersDialog → Dialog + FiltersList  
VoteButton → VoterTooltip  
ReactionStatistics → VoteButton  
RelationshipManagerAccordion → Accordion + Button  
RelatedCasesAccordion → RelationshipManagerAccordion  
RelationshipManagerDialog → Dialog + Button + RelationshipManagerList  
Header → Button + MoreOptionsMenu  
MenuList → (none)  
CaseList → Skeleton + Button  
CaseDetails → CaseInformation + CaseComments + CaseEssentialDetails  
  CaseInformation → Button + EditableTitle + EditableTextarea + MoreOptionsMenu + ConfirmationDialog  
  CaseComments → Textarea  
  CaseEssentialDetails → Button + EditableSelect  
CustomerDetails → CustomerInformation + RelatedCasesAccordion  
UserDetails → UserInformation + RelatedCasesAccordion  

### Tier 4: Pages
CasePage → CaseList + CaseDetails  
CustomerPage → CustomerList + CustomerDetails  
UserPage → UserList + UserDetails  
CreateCasePage → (form with Input, Select, Button)  

## Feeds Into

`figma:figma-generate-library` Phase 3. Hand this build order to the library skill so it processes components in dependency order — atoms before molecules, components before pages.

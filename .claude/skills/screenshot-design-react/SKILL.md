---
name: screenshot-design-react
description: 'Design React components from screenshots, images, mockups, or UI captures. Use when given at least one visual input (without a Figma URL) to analyze structure, variants, and propose React component APIs before implementation.'
argument-hint: 'What screenshot(s) should be analyzed and what component should be designed?'
---

# Skill: Design React Components from Screenshots

This skill analyzes UI screenshots and proposes React component architecture and props APIs. It helps translate visual designs into implementation-ready component specifications when no Figma source is available.

## When to Use

- User provides one or more screenshots and wants React component design guidance
- A UI exists (mock, app screenshot, handoff image) but there is no Figma URL
- Planning component APIs and boundaries before implementation
- Determining likely variants and configurable props from visual evidence

## What This Skill Does NOT Do

- Build or implement the actual React components
- Generate production code
- Infer hidden behavior with certainty when not visible in screenshots
- Replace design-source validation when a Figma file is available

## Required Inputs

1. **Screenshot(s)**: One or more images showing the target UI/component (minimum required: 1)
2. **Context (recommended)**:
   - Component purpose or page context
   - Interaction expectations (if known)
   - Responsive behavior notes (if known)

If no screenshot/image/mockup/UI capture is provided, stop and ask for at least one before continuing.

## Design Principle

**Use screenshot evidence as source of truth, and explicitly label assumptions.**

When designing component APIs from screenshots:

- **DO** derive structure, spacing patterns, and visible states directly from images
- **DO** mark uncertain areas as assumptions and keep API decisions conservative
- **DO** propose the smallest component surface that satisfies observed variants
- **DO NOT** invent variants, states, or interactions that are not visible or explicitly provided

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. GATHER - Collect screenshots and usage context               │
├─────────────────────────────────────────────────────────────────┤
│ 2. SAVE - Store visual/design notes in .temp/design-components/ │
├─────────────────────────────────────────────────────────────────┤
│ 3. ANALYZE - Extract structure, variants, and configurable parts│
├─────────────────────────────────────────────────────────────────┤
│ 4. PROPOSE - Suggest component API(s) with props and types      │
├─────────────────────────────────────────────────────────────────┤
│ 5. FLAG - Document assumptions and validation questions          │
└─────────────────────────────────────────────────────────────────┘
```

## Required Flow

Follow this sequence exactly:

1. Confirm available screenshots and what each one represents (state, viewport, theme, etc.).
2. Capture all observable UI details in a structured design context.
3. Separate **observed facts** from **assumptions**.
4. Infer variants and props only from visible differences across screenshots.
5. Produce a conservative component API proposal and call out open questions.
6. Recommend validation steps for assumptions before implementation.

## Step-by-Step Instructions

### Step 1: Gather Screenshot Inputs

Identify and record:

- Number of screenshots and filenames/labels
- UI state shown in each (default, hover-like, error, filled, loading, mobile, desktop)
- Scope of work (single component vs section vs full page)

If context is missing, ask concise clarifying questions focused on:

- Intended interactions
- Expected breakpoints/responsive behavior
- Reusability requirements across features

### Step 2: Create Output Directory and Save Design Context

Create the output directory:

```
.temp/design-components/{COMPONENT_NAME}/
```

Where `{COMPONENT_NAME}` is derived from the intended React component name (kebab-case).

Save analysis notes using this exact required filename: `.temp/design-components/{COMPONENT_NAME}/design-context.md`.

```markdown
# Design Context: {ComponentName}

## Source

Screenshot-based design (no Figma URL)

## Inputs

- screenshot-1: {label/purpose}
- screenshot-2: {label/purpose}

## Observed Facts

- {Only directly visible facts from screenshots}

## Assumptions

- {Any inferred behavior/variant not directly visible}

## Open Questions

- {Questions that should be validated with designer/PM/user}
```

### Step 3: Analyze Screenshot Design

Extract and analyze:

1. **Component Boundaries**
   - Where the component starts/ends
   - Which nested elements should be slots/children vs internal markup

2. **Visual Variants (Evidence-Based)**
   - Differences across screenshots that imply variant props
   - Size/layout shifts (mobile vs desktop)
   - Style variations (primary/secondary/destructive-like patterns)

3. **Component Properties**
   - Optional visual regions (icon/avatar/badge/helper text)
   - Configurable text blocks (title/label/description/action text)
   - Optional controls (buttons, toggles, links)

4. **State Clues**
   - Disabled/error/selected/loading indicators if visibly present
   - Pseudo-states (hover/focus/pressed) should be treated as styling concerns unless behavior is explicitly provided

5. **Structural Differences**
   - DOM/layout changes between observed states
   - Whether differences justify one component with props or multiple components

6. **Child Component Configurability Assessment**

   When nested reusable elements are visible (e.g., button/input/chip), evaluate if parent API should expose them for composition.

   Recommend configurability when:
   - Child content or style likely varies by use case
   - Screenshot shows one concrete instance but parent is likely reused
   - Parent would become too rigid with hardcoded child output

   Favor practical APIs such as:
   - Component props (`primaryAction`, `secondaryAction`)
   - Slot props (`icon`, `footer`, `actions`)
   - `children`/render-props only when structure flexibility is necessary

### Step 4: Propose Component API

Create this exact required filename: `.temp/design-components/{COMPONENT_NAME}/proposed-api.md`:

````markdown
# Proposed API: {ComponentName}

## Source

Screenshot-based design (no Figma URL)

## Summary

{What this component does and where it is used}

## Confidence

- High-confidence decisions: {from direct visual evidence}
- Assumption-based decisions: {items requiring confirmation}

## Recommended Component Structure

{Single component or multiple components, with rationale}

---

## Component: {ComponentName}

### Props Interface

```typescript
interface {ComponentName}Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  disabled?: boolean;
}
```
````

### Prop Details

| Prop    | Type      | Default   | Source Evidence      | Notes                              |
| ------- | --------- | --------- | -------------------- | ---------------------------------- |
| variant | union     | inferred  | screenshot diffs     | Mark as assumption if not explicit |
| size    | union     | inferred  | viewport/scale diffs | Map from observed sizing           |
| title   | string    | optional  | visible text layer   | -                                  |
| icon    | ReactNode | undefined | visible icon region  | slot for flexibility               |

### Excluded from Props (Handled by Styling/Internal State)

| Visual Detail            | Reason                            |
| ------------------------ | --------------------------------- |
| Hover-only style changes | CSS pseudo-state handling         |
| Focus ring styling       | CSS/accessibility styling concern |

### Example Usage

```tsx
<{ComponentName}
  variant="primary"
  title="Example"
  actions={<Button>Continue</Button>}
/>
```

---

## Assumptions to Validate

- {List of uncertain decisions}

```

## Decision Guidelines

### When to Create Multiple Components

Create separate components when:
- Screenshots show fundamentally different structures (not just style changes)
- Required props/behavior differ significantly
- A section is better modeled as a composition of smaller reusable parts

Keep as one component when:
- Differences are mostly visual variants
- A single prop interface can cleanly represent observed variations

### Props to Include vs Exclude

Include as props:
- Variants and content that are clearly visible across screenshots
- Optional regions that users will likely customize
- Structural toggles with clear visual evidence

Exclude from props:
- Pure pseudo-states (`hover`, `pressed`, `focus-visible`) without behavioral context
- Highly speculative options not grounded in screenshots or provided requirements

### Naming Conventions

Use concise React-friendly prop naming:

| Screenshot Concept | React Prop |
|--------------------|-----------|
| Primary/Secondary visual treatment | `variant` |
| Compact/Default/Large appearance | `size` |
| Optional icon region | `icon` |
| Footer action area | `actions` |

## Output Files

Use these exact filenames (do not rename):

```

.temp/design-components/{component-name}/
├── design-context.md # Screenshot observations + assumptions + questions
└── proposed-api.md # Suggested API(s) with confidence notes

````

## Example Session

**User:** Design a React component from this screenshot of a settings card.

**Agent:**
1. Reviews screenshot(s) and labels visible states
2. Creates `.temp/design-components/settings-card/`
3. Writes `design-context.md` with observed facts vs assumptions
4. Proposes `SettingsCardProps` in `proposed-api.md`
5. Lists assumptions to confirm before implementation

**Agent Response:**

```text
Design analysis complete for SettingsCard.

Created: .temp/design-components/settings-card/

Included:
- Observed visual structure and inferred variants
- Proposed props interface with evidence mapping
- Assumptions and validation questions for missing interaction details

See: .temp/design-components/settings-card/proposed-api.md
````

## Related Skills

- **create-react-modlet**: Use next when implementing the proposed component
- **figma-design-react**: Use instead when a Figma URL is available
- **figma-implement-component**: Use when implementation should follow Figma directly

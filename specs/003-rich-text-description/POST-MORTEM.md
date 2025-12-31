# Implementation Post-Mortem: Rich Text Editor

## Overview

This document details the issues encountered during implementation of the rich text editor using Slate.js, after the initial `speckit.implement` run completed all tasks.

## Issues Discovered During User Testing

### 1. **Critical: Infinite Normalization Loop Crash**

**Symptom:** Toggling list format caused "Could not completely normalize the editor after 168 iterations" error, crashing the app.

**Root Cause:**

- The `withLists` plugin had overly complex normalization logic (lines 29-37 in original)
- When `toggleList` wrapped paragraphs in list-items, the normalizer detected non-list-item children and wrapped them again
- This created an infinite loop: wrap → normalize → wrap → normalize → crash

**Why It Happened:**

- Attempted to be "too smart" with normalization by enforcing strict list structure
- Didn't trust Slate.js to handle its own document structure
- Over-engineered a solution instead of following the official Slate.js examples

**Fix:** Simplified normalization to only ensure list-items have at least one child, removed aggressive wrapping logic.

---

### 2. **High: Lists Rendering Outside Textarea Bounds**

**Symptom:** Lists rendered half outside the editor container, breaking the layout.

**Root Cause:**

- Missing CSS overflow/containment on the Editable component
- Lists with padding extended beyond container bounds

**Why It Happened:**

- Focused on functionality without testing visual rendering thoroughly
- Didn't add basic CSS constraints during initial implementation

**Fix:** Added `overflow-x-auto` to Editable component className.

---

### 3. **Medium: Missing Heading Dropdown**

**Symptom:** Only an H2 button existed instead of a dropdown with all heading levels.

**Root Cause:**

- Implementation deviated from Figma specification
- Spec clearly stated "Heading 2 format from a heading dropdown selector" (FR-004)
- Only implemented heading-two type, ignoring the dropdown requirement

**Why It Happened:**

- Didn't verify implementation against Figma designs
- Missed the "dropdown" requirement in spec, interpreted as simple button
- Only supported heading-two initially instead of all 6 heading levels

**Fix:**

- Created dropdown component with Paragraph and Heading 1-6 options
- Moved to start of toolbar per Figma design
- Added all heading types (heading-one through heading-six) to schema and renderers

---

### 4. **Critical: Enter Key Not Working**

**Symptom:** Pressing Enter didn't create new lines in normal text, only worked in lists.

**Root Cause:**

- Custom `handleListEnter` was intercepting ALL Enter key presses
- Over-engineered keyboard handling that fought with Slate.js built-in behavior

**Why It Happened:**

- Tried to manually handle list Enter behavior instead of trusting Slate
- Added custom keyboard handlers without understanding that Slate handles this natively
- Didn't reference the official Slate.js examples which show minimal keyboard handling

**Fix:** Removed all custom Enter/Tab handlers, let Slate.js handle keyboard events naturally (only kept hotkey handlers for Cmd+B, etc).

---

### 5. **High: Invalid Rich Text Format Error with Links/Headings**

**Symptom:** Saving content with links or headings (1, 3-6) caused "Invalid rich text format" validation error.

**Root Cause:**

- Circular dependency in Zod schema definitions
- Schema only included heading-two, but implementation added heading-one through heading-six
- `linkSchema` was in circular reference with `descendantSchema`

**Why It Happened:**

- Expanded heading support without updating validation schemas
- Zod lazy loading wasn't properly structured for recursive validation
- Links as inline elements created complex schema dependencies

**Fix:**

- Added schemas for all heading levels (headingOneSchema through headingSixSchema)
- Restructured schema to define `descendantSchema` first using `z.lazy()`
- Eventually removed link support entirely due to persistent validation issues

---

### 6. **Medium: Link Feature Removed**

**Symptom:** Links kept causing validation errors even after schema fixes.

**Root Cause:**

- Inline elements (links) within block elements created complex recursive validation
- The interaction between `baseElementSchema` and `descendantSchema` was problematic
- Links are inline elements that can be nested, creating schema complexity

**Why It Happened:**

- Underestimated the complexity of inline vs block element validation in Zod
- Attempted to support links without fully understanding the schema implications
- Time pressure led to removing the feature rather than debugging further

**Fix:** Completely removed link functionality from types, schemas, toolbar, editor, and renderer.

---

### 7. **Critical: List Items Not Getting Bullets/Numbers on Enter**

**Symptom:** Creating new lines in lists didn't show bullet/number markers, just indented text.

**Root Cause:**

- Wrong list structure: paragraphs were wrapped in lists instead of list-items
- `toggleList` implementation didn't match Slate.js example pattern
- Custom logic tried to wrap paragraphs in list-items and then wrap those in lists

**Why It Happened:**

- Didn't study the official Slate.js rich text example closely enough
- Created custom implementation instead of following proven patterns
- Misunderstood that blocks should become list-items, not stay as paragraphs

**Fix:** Rewrote `toggleList` to match Slate.js example:

```typescript
// Correct approach from Slate.js example:
// 1. Unwrap any existing lists
// 2. Set node type to 'list-item' (not paragraph)
// 3. Wrap the list-item in the list container
```

---

### 8. **Medium: Empty Lines Not Rendering in Read-Only Mode**

**Symptom:** Multiple line breaks in editor didn't show as empty lines when saved/rendered.

**Root Cause:**

- Empty paragraphs (containing only empty text nodes) collapsed to zero height
- CSS default behavior for empty `<p>` tags removes visual space

**Why It Happened:**

- Didn't consider edge case of empty paragraphs during implementation
- Focused on content-filled paragraphs, not empty ones

**Fix:**

- Added `min-h-[1.5em]` to paragraph styling
- Inserted `<br />` tag explicitly for empty paragraphs in renderer

---

## Key Lessons Learned

### 1. **Trust the Framework**

The biggest mistake was not trusting Slate.js to handle its own behavior. The official examples show minimal custom code because Slate handles most editing behavior natively (Enter key, list behavior, etc.).

### 2. **Follow Official Examples**

Every major issue stemmed from deviating from the official Slate.js rich text example. The example exists for a reason - it shows the correct patterns and minimal approach.

### 3. **Don't Over-Engineer**

- Custom normalization logic → infinite loops
- Custom keyboard handlers → broken Enter key
- Complex list wrapping → wrong structure

Simple solutions following framework conventions would have avoided all these issues.

### 4. **Validate Against Specs Early**

The heading dropdown issue could have been caught by reviewing the Figma designs during implementation instead of after user testing.

### 5. **Test Edge Cases**

- Empty paragraphs
- List behavior
- Validation with all element types

These should have been tested before marking implementation complete.

### 6. **Understand Schema Implications**

Adding features (like links or new heading levels) requires updating validation schemas. This wasn't done systematically, causing validation errors in production.

### 7. **Incremental Complexity**

Should have started with the simplest possible implementation (just text and paragraphs), validated it worked, then added features one by one with full testing.

---

## What Should Have Been Done Differently

1. **Start with the Slate.js example** - Copy the official rich text example structure exactly, then adapt styling
2. **No custom normalization** - Only add normalization if absolutely necessary and well-tested
3. **No custom keyboard handling** - Let Slate handle Enter, Tab, etc. unless there's a specific requirement
4. **Schema-first for new features** - Update validation schemas BEFORE implementing new element types
5. **Visual testing** - Check Figma designs against implementation during development, not after
6. **Edge case testing** - Test empty states, multiple selections, boundary conditions before completion
7. **Reference implementations** - When stuck, look at working Slate.js examples rather than inventing solutions

---

## Conclusion

The initial implementation from `speckit.implement` was structurally correct but over-engineered and didn't follow Slate.js best practices. Most bugs stemmed from:

- Not trusting the framework to handle its own behavior
- Over-engineering solutions instead of following simple patterns
- Not validating against specs/designs during development
- Missing schema updates when adding features

The final working implementation is much simpler, follows the official Slate.js example patterns, and trusts the library to do what it was designed to do.

---

## Could This Have Been "One-Shottable" with Better Specs?

### Honest Assessment: **70-80% One-Shottable with Improved Speckit Process**

Looking at the 8 issues encountered, most could have been prevented with better specification and review before implementation.

### ✅ Definitely Preventable with Better Specs (Issues 1, 2, 3, 4, 7, 8):

#### **1. Heading Dropdown Issue (Issue #3)**

**Preventable if `research.md` included:**

- The Slate.js official example code showing dropdown pattern
- Explicit Figma design reference: "Shows [Heading 2 ▾] dropdown format"

**Preventable if `plan.md` explicitly stated:**

- "Use dropdown component for heading selection (Heading 1-6), not individual buttons"
- "Reference Figma design showing dropdown UI pattern"

#### **2. Not Following Slate.js Patterns (Issues #1, #4, #7)**

**Preventable if `research.md` contained:**

```markdown
## Slate.js Official Rich Text Example

[Include full code example]

### Key Patterns to Follow:

- ✅ Minimal normalization - only ensure list-items have children
- ✅ No custom keyboard handling - Slate handles Enter/Tab natively
- ✅ toggleBlock pattern: unwrap → set type → wrap if activating
- ❌ DON'T: Add custom Enter handlers (breaks native behavior)
- ❌ DON'T: Wrap nodes inside normalizeNode (causes infinite loops)
```

**Preventable if `plan.md` mandated:**

- "CRITICAL: Copy Slate.js example structure - do NOT reinvent"
- "⚠️ Anti-pattern: Custom normalization that wraps nodes causes infinite loops"
- "Let Slate handle keyboard events - only intercept hotkeys (Cmd+B, etc)"

#### **3. Schema Validation Errors (Issue #5)**

**Preventable if `plan.md` had a checklist:**

```markdown
## Schema Update Checklist

When adding ANY new element type:

1. [ ] Add TypeScript type definition
2. [ ] Add Zod schema for that type
3. [ ] Add to Element union type
4. [ ] Add to elementSchema union
5. [ ] Add to descendantSchema if inline
6. [ ] Test validation with sample data
```

#### **4. Edge Case Issues (Issues #2, #8)**

**Preventable if `contracts/rich-text-editor-component.md` specified:**

```markdown
## Edge Case Test Scenarios

- [ ] Empty paragraphs should render with minimum height
- [ ] Multiple line breaks should display as empty lines
- [ ] Lists should not overflow container bounds (add overflow-x-auto)
- [ ] Pressing Enter in lists creates new list-item with marker
```

### 🤔 Possibly Preventable (Issue #1 - Infinite Loop):

**Harder to catch in specs, but could warn:**

```markdown
# plan.md - Normalization Guidelines

⚠️ Normalization Anti-Patterns:

- Don't wrap/unwrap nodes inside normalizeNode
- Don't create nodes that trigger re-normalization
- Keep normalization minimal - trust Slate's defaults

✅ Safe normalization:

- Only ensure required children exist
- Don't modify structure, only validate it
```

### ❌ Hard to Prevent Even With Perfect Specs (Issue #6 - Link Validation):

**The link/inline element validation complexity** - This is a deep technical issue with recursive Zod schemas that would likely require trial-and-error even with excellent specs. The interaction between inline elements (links) and block elements creates schema complexity that's hard to predict.

---

## Specific Improvements to Speckit Workflow

### 1. Enhanced Research Phase

```markdown
# research.md should always include:

✅ Full working code examples from official framework docs
✅ "Anti-patterns" section - what NOT to do
✅ Known gotchas from GitHub issues/Stack Overflow
✅ Explicit comparison to Figma designs
✅ Edge cases and boundary conditions

Example:

## Slate.js Best Practices

✅ DO: Copy official example structure
✅ DO: Trust framework defaults
❌ DON'T: Custom keyboard handling
❌ DON'T: Complex normalization
```

### 2. Prescriptive Planning

```markdown
# plan.md should be explicit about:

✅ "Copy this exact example structure" (include code)
✅ Critical checklists (schema updates, validation steps)
✅ "Trust the framework" vs "custom implementation needed"
✅ File-to-file relationships ("when you edit X, also update Y")
✅ Anti-patterns to avoid

Example:

## Implementation Approach

FOLLOW SLATE.JS EXAMPLE: [link to example]

- Copy toggleBlock pattern exactly
- Copy element rendering pattern exactly
- DO NOT add custom Enter/Tab handlers
```

### 3. Comprehensive Contracts

```markdown
# contracts should include:

✅ Happy path test cases
✅ Edge case scenarios (empty, boundary conditions)
✅ Visual regression expectations
✅ Keyboard interaction specifications
✅ Cross-browser compatibility notes

Example:

## Test Scenarios

1. Empty paragraph: Should render with visible height
2. Enter in list: Should create new numbered/bulleted item
3. Three line breaks: Should show three empty lines in read mode
```

### 4. Implementation Review Checklist

```markdown
# tasks.md should include review steps:

Before marking Phase X complete:

- [ ] Compared implementation to Figma designs
- [ ] Tested all edge cases in contracts
- [ ] Verified schemas updated for new element types
- [ ] Confirmed following framework example patterns
- [ ] No custom reimplementation of framework features
- [ ] Visual testing in browser completed
```

---

## Recommended Improved Workflow

```
1. Run .research → REVIEW THOROUGHLY
   ✓ Is official framework example included with full code?
   ✓ Are anti-patterns explicitly documented?
   ✓ Does it reference and compare to Figma designs?
   ✓ Are edge cases and gotchas documented?

2. Add to research.md if missing:
   - Full working examples from framework docs
   - "What NOT to do" section
   - Figma design comparisons

3. Run .plan → REVIEW + ENHANCE
   ✓ Does it say "follow example X exactly"?
   ✓ Are schema/type update checklists explicit?
   ✓ Are edge case reminders included?
   ✓ Are anti-patterns called out?

4. Add to plan.md if missing:
   - "Copy this structure" directives
   - Critical update checklists
   - Anti-pattern warnings

5. Run .tasks → VERIFY COMPLETENESS
   ✓ Do tasks include "compare to Figma" steps?
   ✓ Are validation/edge case testing tasks included?
   ✓ Is there a review checklist before completion?

6. Add review checklist to each phase if missing

7. Run .implement → EXPECT 70-80% SUCCESS
   - Most preventable bugs avoided by good specs
   - Remaining 20-30% = legitimate implementation complexity
   - Normal debugging and iteration
```

---

## Key Insight: Better Specs = Fewer Preventable Bugs

**What better specs CAN prevent:**

- Spec deviation (wrong UI component, missing features)
- Not following framework patterns (over-engineering)
- Missing schema updates (validation errors)
- Ignoring edge cases (empty states, visual issues)
- Skipping design validation (not matching Figma)

**What better specs CANNOT prevent:**

- Deep technical complexity (recursive schemas, inline elements)
- Framework/library quirks discovered during implementation
- Integration issues only visible when running the app
- Legitimate "figure it out" engineering challenges

**The Goal:** Move from 50% success to 70-80% success by eliminating _preventable_ bugs through:

1. More comprehensive research (with examples and anti-patterns)
2. More prescriptive planning (explicit instructions, checklists)
3. More thorough contracts (edge cases, visual specs)
4. Built-in review steps (validation checkpoints)

The remaining 20-30% of issues will always exist because software development inherently involves:

- Discovery during implementation
- Integration complexity
- Framework limitations
- Edge cases that only appear in practice

**Conclusion:** This feature could have been 70-80% one-shottable with better speckit process, but expecting 100% is unrealistic. The goal should be to eliminate preventable bugs through better specs, while accepting that some iteration and debugging is normal engineering work.

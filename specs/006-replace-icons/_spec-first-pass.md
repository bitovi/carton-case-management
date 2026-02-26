# Replace Lucide Icons with Kendo SVG Icons

## Overview

Replace all lucide-react icons with @progress/kendo-svg-icons throughout the client application. This will standardize the icon library to match the KendoReact UI components already in use.

## Current State

### Lucide Icons in Use

The codebase currently uses **38 files** with lucide-react imports. Below is a comprehensive inventory of all unique lucide icons:

**Navigation & Layout:**

- `ChevronDown` - Accordion triggers, dropdowns, selects
- `ChevronUp` - Select component
- `ChevronLeft` - Calendar navigation
- `ChevronRight` - Calendar navigation

**Actions:**

- `Check` - Checkboxes, selects, confirmation badges, edit controls
- `X` - Close buttons (dialog, badges), cancel actions, edit controls
- `Plus` - Add buttons, relationship accordion
- `Minus` - Indeterminate checkbox state
- `Edit2` - More options menu stories/tests
- `Trash` / `Trash2` - Delete actions in various components
- `Download` - Button stories
- `Share2` - More options menu stories

**Status & Feedback:**

- `AlertCircle` - Alert stories, badges
- `Info` - Alert component
- `Loader2` - Loading states (EditableTextarea, EditableTitle, BaseEditable)

**User & Content:**

- `User` - Select stories/tests, MultiSelect stories/tests
- `UserCircle` - More options menu stories
- `Users` - App navigation, menu list stories
- `Mail` - Input stories, select stories
- `MessageSquare` - App navigation (chat icon)

**Navigation Icons:**

- `Home` - Menu list stories/tests
- `Settings` - Menu list stories/tests, select stories
- `FolderClosed` - App navigation

**Form & Input:**

- `Search` - Input component
- `Calendar` (as CalendarIcon) - Date picker components (Popover, EditableDate)
- `DollarSign` - EditableCurrency component
- `Percent` - EditablePercent component
- `ListFilter` - FiltersTrigger component

**Menu & Actions:**

- `MoreVertical` - More options menu, case/customer/user information components
- `Star` - CustomerInformation component
- `ThumbsUp` / `ThumbsDown` - VoteButton component
- `Bot` - App navigation

### Dependencies

**Current:**

- `lucide-react: ^0.469.0` in client package.json

**To Add:**

- `@progress/kendo-svg-icons: ^latest` (needs to be installed)

**Existing KendoReact:**

- `@progress/kendo-react-common: ^14.2.0`
- `@progress/kendo-react-dropdowns: ^14.2.0`
- `@progress/kendo-react-layout: ^14.2.0`

## Implementation Plan

### Phase 1: Setup & Discovery

#### Step 1.1: Install Kendo SVG Icons Package

Install the @progress/kendo-svg-icons package to the client workspace.

**Actions:**

```bash
cd packages/client
npm install @progress/kendo-svg-icons
```

**How to verify:**

- Package appears in `packages/client/package.json` dependencies
- No installation errors
- Type definitions are available

#### Step 1.2: Research Icon Mapping

Map each Lucide icon to its Kendo SVG icon equivalent. The Kendo SVG Icons library uses a different naming convention and may not have 1:1 matches for all icons.

**Actions:**

- Review Kendo SVG Icons documentation: https://www.telerik.com/kendo-react-ui/components/styling/svg-icons/
- Create a mapping document listing:
  - Lucide icon name
  - Kendo SVG icon name (exact match or best alternative)
  - Import path from @progress/kendo-svg-icons
  - Any visual/semantic differences to note

**How to verify:**

- Every lucide icon (listed above) has a mapped Kendo equivalent
- Mapping document includes import examples
- Note any icons without direct equivalents

### Phase 2: Create Icon Wrapper (Optional)

#### Step 2.1: Evaluate Need for Icon Wrapper

Determine if we need a wrapper component to standardize icon usage across the app, or if direct Kendo SVG icon usage is sufficient.

**Considerations:**

- Kendo SVG icons may have different props API than Lucide
- Wrapper could provide consistent sizing, className handling
- Wrapper could make future icon library changes easier

**Decision Point:**

- If icon APIs are similar enough, skip wrapper (simpler, less abstraction)
- If significant differences exist, create `packages/client/src/components/ui/Icon/` wrapper

**How to verify:**

- Document decision in spec
- If creating wrapper, define props interface

### Phase 3: Systematic Replacement

#### Step 3.1: Component Categories

Replace icons in logical groups to minimize merge conflicts and make reviews manageable. Process in this order:

**3.1.1: Base UI Components (obra/)**
Components in `packages/client/src/components/obra/` that are reused throughout the app:

- Accordion (ChevronDown)
- Alert (Info, AlertCircle)
- Badge (Check, X, AlertCircle)
- Button (Plus, Trash2, Download)
- Calendar (ChevronLeft, ChevronRight)
- Checkbox (Check, Minus)
- Dialog & DialogHeader (X)
- Input (Search, X, Mail)
- Popover (Calendar)
- Select (Check, ChevronDown, ChevronUp, User, Mail, Settings, Trash2)

**How to verify:**

- Run tests: `npm test --workspace=packages/client`
- View components in Storybook: `npm run storybook --workspace=packages/client`
- Visually compare icons before/after
- All stories still render correctly
- No console errors or warnings

**3.1.2: Inline Edit Components**
Components in `packages/client/src/components/inline-edit/`:

- BaseEditable (Loader2)
- EditControls (Check, X)
- EditableTextarea (Loader2)
- EditableTitle (Check, X, Loader2)
- EditableDate (Calendar)
- EditableCurrency (DollarSign)
- EditablePercent (Percent)

**How to verify:**

- Run tests for inline-edit components
- Check Storybook stories
- Test edit mode interactions work correctly
- Loading states display properly

**3.1.3: Common Domain Components**
Components in `packages/client/src/components/common/`:

- FiltersTrigger (ListFilter)
- MenuList (Home, Settings, Users)
- MoreOptionsMenu (MoreVertical, Edit2, Trash2, Share2, UserCircle)
- MultiSelect (ChevronDown, User)
- RelationshipManagerAccordion (Plus)
- VoteButton (ThumbsUp, ThumbsDown)

**How to verify:**

- Run tests for common components
- Check Storybook stories
- Test interactive states

**3.1.4: Feature-Specific Components**
Components in feature folders:

- App.tsx (FolderClosed, Users, Bot, MessageSquare)
- CaseDetails/CaseInformation (MoreVertical, Trash)
- CustomerDetails/CustomerInformation (MoreVertical, Trash, Star)
- UserDetails/UserInformation (MoreVertical, Trash)

**How to verify:**

- E2E tests pass: `npm run test:e2e`
- Manual testing of navigation
- Feature pages render correctly

#### Step 3.2: Replacement Process for Each File

For each file with lucide icons:

1. **Read the component file** to understand:
   - How icons are imported
   - How they're used (props passed, styling)
   - Any size/className conventions

2. **Update the import statement:**

   ```typescript
   // BEFORE
   import { Check, X } from 'lucide-react';

   // AFTER
   import { checkIcon, xIcon } from '@progress/kendo-svg-icons';
   ```

3. **Update icon usage:**
   - Replace JSX icon component with Kendo SVG Icon component
   - Adjust props as needed (size, className, etc.)
   - May need to use SvgIcon wrapper from @progress/kendo-react-common

4. **Update tests** (if the file has `.test.tsx`):
   - Update imports
   - Verify test assertions still work
   - Icon rendering tests may need adjustment

5. **Update stories** (if the file has `.stories.tsx`):
   - Update imports
   - Verify all stories still render
   - Check Controls panel still works

6. **Run validation:**
   ```bash
   npm run typecheck --workspace=packages/client
   npm test --workspace=packages/client -- <component-name>
   ```

### Phase 4: Cleanup

#### Step 4.1: Remove Lucide Dependency

After all files are converted:

**Actions:**

```bash
cd packages/client
npm uninstall lucide-react
```

**How to verify:**

- lucide-react removed from package.json
- Run full test suite: `npm test`
- Run E2E tests: `npm run test:e2e`
- Build succeeds: `npm run build --workspace=packages/client`
- No import errors

#### Step 4.2: Update Documentation

**Actions:**

- Add icon usage guidelines to `.github/instructions/client.instructions.md`
- Document how to import and use Kendo SVG icons
- Note any common patterns or conventions

**How to verify:**

- Documentation is clear and includes examples
- Other developers can follow icon usage guidelines

#### Step 4.3: Visual Regression Check

**Actions:**

- Build Storybook: `npm run build-storybook --workspace=packages/client`
- Review all stories for visual differences
- Take before/after screenshots of key components (optional)

**How to verify:**

- All icons render correctly in Storybook
- No broken layouts or styling issues
- Icons maintain appropriate sizing and spacing

### Phase 5: Validation

#### Step 5.1: Comprehensive Testing

Run all test suites to ensure nothing broke:

**Actions:**

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build --workspace=packages/client
```

**How to verify:**

- All tests pass
- No type errors
- No lint errors
- Build completes successfully
- No runtime errors in browser console

#### Step 5.2: Manual Testing Checklist

Test key user flows in the running application:

- [ ] Navigate between pages using main navigation icons
- [ ] Open and close dialogs (X icon)
- [ ] Use dropdown selects (chevron icons)
- [ ] Edit inline fields (check, X, loading icons)
- [ ] Open accordion sections (chevron icons)
- [ ] Use calendar date picker (calendar icon, navigation chevrons)
- [ ] View alerts with info/warning icons
- [ ] Use more options menus (three-dot menu)
- [ ] Filter content (filter icon)
- [ ] Test vote buttons (thumbs up/down)

**How to verify:**

- All icons display correctly
- Icon interactions work as expected
- No visual glitches or misaligned icons
- Loading states show loading icons

## Rollback Plan

If issues are discovered after deployment:

1. **Immediate:** Revert the commit(s) that removed lucide-react
2. **Reinstall:** `npm install lucide-react@^0.469.0`
3. **Rebuild:** `npm run build --workspace=packages/client`
4. **Redeploy:** Use previous working version

## Questions

1. Should we create an icon wrapper component (`<Icon />`) for consistency, or use Kendo SVG icons directly throughout the codebase?
   use icons directly

2. Are there any specific icon design guidelines or sizing standards we should follow (e.g., all icons 16px, 20px, 24px)?
   No, just size them about the same as what they are replacing

3. Should we prioritize exact visual matches, or is semantic equivalence sufficient (e.g., a slightly different "trash" icon is acceptable)?
   semantic equivalence

4. Is there a preferred branch strategy for this work (single large PR vs. multiple smaller PRs per component category)?
   single PR

5. Should we update any design system documentation or Figma files to reflect the Kendo icon usage?
   Yes, update any mention of Lucide

6. Are there any accessibility requirements for icons (e.g., aria-labels, titles) that should be standardized during this migration?
   no

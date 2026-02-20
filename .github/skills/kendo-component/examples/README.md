# Examples Directory

This directory contains example KendoUI component implementations that demonstrate patterns and best practices.

## Adding Examples

To add an example, create a folder with this structure:

```
examples/
└── feature-name/
    ├── README.md           # Description and usage
    ├── Component.tsx       # Implementation
    ├── Component.test.tsx  # Tests
    └── Component.stories.tsx # Storybook stories
```

## Example Template

### README.md (Example)

```markdown
# Example: [Feature Name]

## Overview
Brief description of what this component does.

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Pattern Used
Describe the KendoUI pattern or approach.

## Tech Stack
- KendoUI component(s): [list]
- Data source: [tRPC/props/static]
- Styling: [Tailwind/CSS modules]

## Key Implementation Details
Explain non-obvious decisions or patterns.

## Integration
How to use this component in actual features.

### Props
```typescript
interface Props {
  // Props and descriptions
}
```

### Usage
```tsx
<ComponentName
  prop1={value1}
  prop2={value2}
/>
```

## Related
- Links to related examples
- Links to KendoUI docs
```

## Planned Examples

Future examples to add:

- [ ] **Case Data Grid**: Grid with filtering, sorting, pagination, row selection
- [ ] **Case Create Form**: Form with validation, async submission
- [ ] **Status Filter**: Dropdown filter with multiple selection
- [ ] **Date Range Picker**: Date range filtering with calendar
- [ ] **Batch Actions Dialog**: Dialog for bulk operations on selected rows
- [ ] **Detail View Panel**: Drawer/panel for expanded item details
- [ ] **Search Bar**: KendoUI search with autocomplete
- [ ] **Status Editor**: Inline edit for status with dropdown
- [ ] **Export Grid**: Grid with export to CSV functionality

## Example Structure

Each example demonstrates:

1. **Component Definition**
   - Props interface
   - Type safety
   - Default values

2. **KendoUI Configuration**
   - Relevant props for selected component
   - State management
   - Event handling

3. **Styling**
   - Tailwind CSS integration
   - Responsive design
   - Theme compatibility

4. **Testing**
   - Unit tests
   - Interaction tests
   - State management tests

5. **Documentation**
   - README with usage
   - Storybook stories
   - Code comments only where non-obvious

## Contributing Examples

When adding an example:

1. **Keep it focused** - Single feature or pattern
2. **Keep it minimal** - Remove unnecessary complexity
3. **Add comments sparingly** - Code should be self-documenting
4. **Include tests** - Every example must be tested
5. **Add Storybook stories** - Visual documentation
6. **Document the pattern** - Explain why this approach was chosen

## Using Examples

1. **As reference** - See how to use a specific KendoUI component
2. **As template** - Copy and adapt for your component
3. **As learning** - Understand patterns and best practices
4. **As testing** - Run examples to verify they work

## Current Examples

(None yet - to be added as components are built)

---

Contributing examples helps the team learn and maintains consistency across KendoUI implementations.

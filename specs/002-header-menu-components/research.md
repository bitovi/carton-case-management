# Research: Responsive Header and Menu Components

**Feature**: 002-header-menu-components  
**Date**: December 29, 2025  
**Purpose**: Research technical approaches, patterns, and best practices for implementing responsive navigation components

## Research Questions & Findings

### 1. Routing and Navigation Pattern

**Question**: How is routing currently implemented in the application? What navigation patterns should we use?

**Finding**:

- Application uses **React Router v6** (`react-router-dom`)
- Routes defined in `packages/client/src/App.tsx` with `<Routes>` and `<Route>` components
- Router wrapped at app root in `main.tsx` with `<BrowserRouter>`
- Current implementation has single route: `path="/" element={<HomePage />`

**Decision**: Use React Router's programmatic navigation

- Use `Link` component from `react-router-dom` for clickable navigation elements (logo, menu items)
- Provides client-side routing without page refresh
- Maintains browser history and back button functionality
- Type-safe route definitions

**Rationale**: `Link` is the standard React Router pattern for navigation, prevents full page reloads, maintains SPA behavior, and provides accessibility features (keyboard navigation, screen reader support)

**Alternatives Considered**:

- Manual `onClick` with `window.location.href`: Causes full page reload, loses React state
- `useNavigate` hook: More complex for simple navigation links, better for programmatic navigation after events
- Anchor tags (`<a href>`): Would cause full page refresh, not recommended for SPAs

### 2. Responsive Design Implementation

**Question**: How should responsive behavior be implemented for desktop vs mobile layouts?

**Finding**:

- Application uses **Tailwind CSS** for styling
- Tailwind config at `packages/client/tailwind.config.js` with standard responsive breakpoints
- Existing components use Tailwind utility classes (e.g., `flex`, `space-y-1.5`, `p-6`)
- Tailwind responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

**Decision**: Use Tailwind responsive modifiers for conditional styling

- Mobile-first approach: Base styles for mobile, modifiers for larger screens
- Breakpoints: `md:` (768px) as primary desktop breakpoint
- Text visibility: `hidden md:inline` for "Case Management" text
- Layout changes: `flex-col md:flex-row` patterns for menu orientation
- Conditional rendering: Use CSS `hidden` utility rather than JavaScript conditionals where possible

**Rationale**: Tailwind's responsive modifiers are declarative, performant (CSS-based), and consistent with existing codebase patterns. Mobile-first approach ensures good performance on smaller devices and progressive enhancement.

**Alternatives Considered**:

- JavaScript media queries (`useMediaQuery` hook): Adds JavaScript overhead, causes re-renders, less performant
- Separate components for mobile/desktop: Code duplication, harder to maintain
- CSS-in-JS libraries (styled-components): Not used in current project, would add unnecessary dependency

### 3. Dropdown Menu Implementation

**Question**: What is the best approach for implementing the user avatar dropdown menu?

**Finding**:

- Project uses **Shadcn UI** components (based on Radix UI primitives)
- Existing components use Radix UI: `@radix-ui/react-slot` found in Button component
- Shadcn UI provides dropdown menu primitives
- Pattern uses `cva` (class-variance-authority) for variant management

**Decision**: Use Shadcn UI Dropdown Menu component

- Install `dropdown-menu` from Shadcn UI registry: `npx shadcn@latest add dropdown-menu`
- Provides accessibility out of the box (ARIA attributes, keyboard navigation)
- Includes trigger, content, and item components
- Handles click-outside-to-close automatically
- Consistent with existing UI component patterns

**Rationale**: Shadcn UI is already the established pattern in the project. It provides production-ready accessible components that handle complex interactions (focus management, keyboard navigation, click-outside) without custom implementation.

**Alternatives Considered**:

- Custom dropdown with state management: Reinventing the wheel, accessibility concerns, more testing required
- Headless UI: Another library, not consistent with current stack
- Material UI: Heavy dependency, design inconsistency with Shadcn UI

### 4. SVG Logo Integration

**Question**: How should the Carton logo SVG be integrated into React components?

**Finding**:

- Vite build tool supports multiple asset import methods
- React components can import SVG files directly
- SVG can be: imported as URL, imported as React component, or inlined

**Decision**: Inline SVG directly in component

- SVG code embedded in component file or separate `.tsx` component
- Allows dynamic styling via props (color changes, size adjustments)
- No additional HTTP request for logo
- Easy to maintain and modify
- Type-safe with TypeScript

**Rationale**: For a single, small logo SVG used in one place, inlining is simple and performant. Avoids asset pipeline complexity, enables dynamic styling, and keeps component self-contained.

**Alternatives Considered**:

- Import as asset URL (`import logoUrl from './logo.svg'`): Extra HTTP request, can't style SVG fills
- Separate SVG component file: Overkill for single usage
- Public folder: Breaks bundler optimization, hard to update

### 5. Component State Management

**Question**: What state management approach is needed for Header and MenuList components?

**Finding**:

- Application uses **React Query** (integrated with tRPC) for server state
- Local component state managed with React hooks (`useState`, `useReducer`)
- No global state management library (Redux, Zustand) in use

**Decision**: Use local React state with `useState`

- Header dropdown: `const [isDropdownOpen, setIsDropdownOpen] = useState(false)`
- No server state required (UI-only components)
- State isolated to Header component
- MenuList is stateless (navigation only)

**Rationale**: These are simple UI components with local, ephemeral state. React's built-in `useState` is sufficient. No need for global state or complex state management for a dropdown menu.

**Alternatives Considered**:

- Context API: Overkill for local component state, adds unnecessary complexity
- Global state library: No cross-component state sharing needed
- URL state: Dropdown state shouldn't be in URL

### 6. Accessibility Requirements

**Question**: What accessibility requirements must be met for WCAG 2.1 AA compliance?

**Finding**:

- Constitution mandates WCAG 2.1 AA standards
- Navigation components are critical for accessibility
- Keyboard navigation and screen reader support required

**Decision**: Implement comprehensive accessibility features

- **Keyboard Navigation**:
  - Tab key navigates to logo, menu items, avatar
  - Enter/Space activates links and dropdown
  - Escape closes dropdown
- **ARIA Labels**:
  - `aria-label="Navigate to home"` on logo
  - `aria-label="User menu"` on avatar
  - `aria-expanded` on dropdown trigger
  - `aria-haspopup="true"` for dropdown
- **Focus Management**:
  - Visible focus indicators (Tailwind's `focus-visible:` utilities)
  - Focus trapped in dropdown when open
- **Semantic HTML**:
  - `<nav>` element for navigation sections
  - `<header>` element for page header
  - Proper heading hierarchy

**Rationale**: Accessibility is non-negotiable per constitution. Using semantic HTML and ARIA attributes ensures screen reader compatibility and keyboard navigation support.

**Alternatives Considered**: None - accessibility is mandatory

### 7. Component Testing Strategy

**Question**: What testing approach should be used for these components?

**Finding**:

- Project uses **Vitest** for unit/integration tests
- **Playwright** for E2E tests
- **Storybook** required per constitution
- Test utilities in `src/test/utils.tsx` provide tRPC/React Query wrappers

**Decision**: Multi-layer testing approach

- **Unit Tests** (Vitest):
  - Header dropdown open/close logic
  - Responsive text display (mock viewport)
  - Navigation link generation
  - Keyboard event handlers
- **Storybook Stories**:
  - Desktop header variant
  - Mobile header variant
  - Dropdown open/closed states
  - MenuList desktop/mobile variants
- **E2E Tests** (Playwright):
  - Click logo → navigate to home
  - Click menu item → navigate to home
  - Click avatar → dropdown opens
  - Click outside → dropdown closes
  - Keyboard navigation flow

**Rationale**: Constitution mandates unit tests for logic, Storybook for component variants, and E2E for user flows. This provides comprehensive coverage at appropriate levels.

**Alternatives Considered**: None - testing requirements are constitutional mandates

### 8. Styling and Design Tokens

**Question**: How should Figma design specifications be translated to Tailwind classes?

**Finding**:

- Tailwind uses CSS custom properties (CSS variables) defined in `index.css`
- Color system: `hsl(var(--primary))`, `hsl(var(--background))`, etc.
- Spacing uses Tailwind's default scale (rem-based)
- Typography uses Tailwind's default font system

**Decision**: Map Figma specs to Tailwind utilities and custom CSS variables

- **Colors**:
  - Header background: Add custom color `--header-bg: 180 32% 18%` (dark teal #1a3a3a approximation)
  - Logo background: Direct hex `#04646A` or add to Tailwind config
  - Menu item background: Use existing `--accent` or add `--menu-item-bg`
- **Spacing**: Use Tailwind spacing scale (`p-4`, `px-6`, `py-3`, etc.)
- **Responsive breakpoints**: Use `md:` prefix for 768px breakpoint
- **Typography**: Use Tailwind font utilities (`text-xl`, `font-semibold`)

**Rationale**: Leveraging Tailwind's design token system (CSS variables) allows theme consistency and easy updates. Custom colors added to theme extend maintain the established pattern.

**Alternatives Considered**:

- Hardcoded hex values in classes: Not maintainable, doesn't support theming
- Inline styles: Loses Tailwind's optimizations and utility composition

## Implementation Recommendations

### Component Architecture

```
Header Component:
├── Carton Logo (inline SVG, clickable via Link)
├── Application Name (responsive text via Tailwind)
└── User Avatar (Shadcn Dropdown Menu)
    └── DropdownMenuContent (empty placeholder)

MenuList Component:
├── Nav container (semantic <nav> element)
└── Menu items (Link components with icon + text)
    └── Home item (initial implementation)
```

### Technology Stack Summary

| Requirement       | Technology Choice               | Rationale                                  |
| ----------------- | ------------------------------- | ------------------------------------------ |
| Navigation        | React Router Link               | SPA routing, accessibility, type safety    |
| Responsive Design | Tailwind CSS utilities          | Mobile-first, performant, existing pattern |
| Dropdown Menu     | Shadcn UI Dropdown              | Accessible, consistent with stack          |
| SVG Logo          | Inline in component             | Simple, no extra requests, styleable       |
| State Management  | React useState                  | Local state sufficient for dropdown        |
| Accessibility     | ARIA + semantic HTML            | WCAG 2.1 AA compliance                     |
| Testing           | Vitest + Storybook + Playwright | Multi-layer per constitution               |
| Styling           | Tailwind + CSS variables        | Design token system                        |

### Development Workflow

1. Create component files and Storybook stories first (TDD approach)
2. Implement Header component with all states in Storybook
3. Implement MenuList component with desktop/mobile variants
4. Write unit tests for component logic
5. Integrate into App.tsx
6. Write E2E tests for navigation flows
7. Manual accessibility testing (keyboard, screen reader)

### Risk Mitigation

- **Design accuracy**: Use Storybook to compare against Figma side-by-side before integration
- **Accessibility**: Use axe DevTools extension to catch ARIA issues early
- **Responsive behavior**: Test on actual devices, not just browser DevTools
- **TypeScript errors**: Enable strict mode and resolve all type issues before integration

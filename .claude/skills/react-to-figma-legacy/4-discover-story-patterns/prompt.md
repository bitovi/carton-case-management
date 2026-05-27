# Discover Story Patterns

Scan existing Storybook stories in the codebase to discover conventions for decorators, mocking, providers, and state simulation. This runs once before any per-component context gathering begins.

## Inputs

- **Source root**: The project source root path (passed by parent)
- **Output directory**: `.temp/react-to-figma/`

## Procedure

### 1. Find all existing story files

Search the codebase for files matching `**/*.stories.{tsx,ts,jsx,js,mdx}`.

Exclude:
- `**/node_modules/**`
- `**/.temp/**`
- `**/*.figma-variants.stories.*` (our own generated stories from prior runs)

Record the count and paths of all discovered story files.

### 2. Find Storybook configuration

Locate and read the Storybook config files:
- `.storybook/main.{ts,js,mjs}` — framework, addons, story glob patterns
- `.storybook/preview.{ts,tsx,js,jsx}` — global decorators, parameters, loaders

From the preview file, extract:
- **Global decorators**: Any decorators applied to all stories (routers, providers, theme wrappers)
- **Global parameters**: Default parameters (viewport, backgrounds, etc.)
- **Loaders**: Any loaders (MSW, data loaders, etc.)
- **Addons with initialization**: Any addon setup (e.g., `initialize()` for MSW)

### 3. Analyze story patterns

Read a representative sample of story files (up to 15, prioritizing diversity — pick from different directories). For each, extract:

#### Decorators
What wrappers are used? Record each unique decorator pattern:
```
Decorator: MemoryRouter wrapping
Usage: <MemoryRouter initialEntries={["/path"]}><Routes><Route ...>{story()}</Route></Routes></MemoryRouter>
Found in: CasePage.stories.tsx, Navigation.stories.tsx
```

#### Mocking approach
How is data mocked? Look for:
- **MSW handlers**: `parameters.msw.handlers`, `http.get(...)`, `http.post(...)`
- **Module mocks**: `jest.mock(...)`, `vi.mock(...)`
- **Mock providers**: Custom provider components that inject mock data
- **Inline mock data**: Hardcoded objects passed as props
- **Storybook loaders**: `loaders` array in story metadata

Record each unique mocking pattern with examples.

#### Provider wrappers
What context providers are wrapped around stories? Common ones:
- Router providers (MemoryRouter, BrowserRouter)
- State management (Redux Provider, Zustand, React Query)
- tRPC providers
- Theme providers
- Auth providers
- Internationalization providers

#### State simulation
How are loading/error/empty states simulated?
- MSW delayed responses: `delay(...)` or `delay('infinite')`
- MSW error responses: `HttpResponse.error()`, status codes
- Mock data shapes: empty arrays, null values
- Component props: `isLoading`, `isError`, `error`

#### Type-safe mock patterns
Look for type imports used for mock data:
- `inferProcedureOutput<AppRouter['procedure']>`
- `Mock<typeof SomeType>`
- Zod schema `.parse()` in mocks

### 4. Analyze Storybook URL structure

From the story files, determine how Storybook generates URLs:
- The `title` field in story metadata → URL path
- The export name → story name in URL
- Example: `title: "Components/Button"` + `export const Primary` → `?path=/story/components-button--primary`

Verify the Storybook base URL (typically `http://localhost:6006`) and the iframe URL pattern (typically `/iframe.html?...`).

### 5. Write output

#### `.temp/react-to-figma/story-patterns.md`

```markdown
# Story Patterns

**Stories found**: {count} files
**Storybook version**: {version from package.json}
**Framework**: {e.g., @storybook/react-vite}
**Storybook URL**: {base URL, e.g., http://localhost:6006}

## Global Setup

### Preview file: {path}
```typescript
{relevant code from preview file — decorators, loaders, parameters}
```

### Addons
{list of addons from main config}

## Decorators

### Global decorators (from preview)
{list with code examples}

### Per-story decorators (discovered)
| Decorator | Purpose | Example | Found in |
|-----------|---------|---------|----------|
| MemoryRouter | Routing context | `<MemoryRouter initialEntries={["/"]}>` | 5 files |
| TrpcProvider | tRPC client | `<TrpcProvider>` | 8 files |
| ThemeProvider | Theming | `<ThemeProvider theme={lightTheme}>` | 2 files |

## Mocking Patterns

### Primary approach: {e.g., MSW, inline mocks, mock providers}

{detailed description with code example}

### Mock data patterns
```typescript
{example of how mock data is typed and structured}
```

### Loading state pattern
```typescript
{example of how loading state is simulated}
```

### Error state pattern
```typescript
{example of how error state is simulated}
```

## Story URL Structure

- Title format: `{typical title pattern, e.g., "Components/ComponentName"}`
- Story URL: `{base}/iframe.html?id={title-kebab}--{export-kebab}&viewMode=story`
- Args URL: `{base}/iframe.html?id={id}&args={key}:{value}`

## Recommendations for Figma Variant Stories

Based on the discovered patterns, new `.figma-variants.stories.tsx` files should:

1. **Use these decorators**: {list}
2. **Mock data using**: {approach}
3. **Simulate loading via**: {approach}
4. **Simulate errors via**: {approach}
5. **Type mock data with**: {approach}
```

### 6. Ensure Baseline story exists

Check if a Baseline story file exists at the same location as other `*.figma-variants.stories.tsx` files (e.g., `components/obra/Baseline/Baseline.figma-variants.stories.tsx`).

If it does NOT exist, create it:

```tsx
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Figma Variants/Baseline",
};

export default meta;
type Story = StoryObj;

export const Blank: Story = {
  render: () => <div data-rtf-baseline />,
};
```

This story renders an empty div used by the capture pipeline to fingerprint Storybook's baseline body elements (chrome, iframes, etc.). The fingerprints are then used to distinguish portal content from Storybook infrastructure during DOM capture.

### 7. Return summary

```
Story pattern discovery complete.
- Story files found: {count}
- Storybook version: {version}
- Global decorators: {count}
- Per-story decorator patterns: {count}
- Mocking approach: {primary approach}
- Provider wrappers: {count unique}
- Output: .temp/react-to-figma/story-patterns.md
```

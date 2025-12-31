# Research: Rich Text Case Description

**Feature**: 003-rich-text-description  
**Date**: 2025-12-30  
**Phase**: 0 - Outline & Research

## Research Tasks

This document consolidates findings for all technical unknowns identified in the Technical Context section of [plan.md](./plan.md).

---

## 1. Slate.js Integration Best Practices

**Decision**: Use Slate.js with slate-react and slate-history packages

**Rationale**:

- Slate.js is a completely customizable framework for building rich text editors
- Provides low-level primitives with full control over rendering and behavior
- Strong TypeScript support with comprehensive type definitions
- Active community and maintained by Basecamp team (used in HEY email)
- Supports plugins for extending functionality (links, lists, formatting)
- Works seamlessly with React component patterns

**Implementation Approach**:

- Install packages: `slate`, `slate-react`, `slate-history`
- Create custom editor instance with `createEditor()` and `withReact()` and `withHistory()`
- Define Slate element types (paragraph, heading, list-item, link)
- Define text marks (bold, italic, underline, strikethrough, code)
- Use `Slate` and `Editable` components for rendering
- Implement custom toolbar using existing UI components (Button, DropdownMenu)

**Alternatives Considered**:

- **Draft.js**: More opinionated, harder to customize, Facebook no longer actively maintaining
- **TipTap**: Excellent but based on ProseMirror, different paradigm and larger bundle size
- **Quill**: Too opinionated with built-in UI, harder to match custom Figma design
- **Lexical**: Facebook's replacement for Draft.js, but newer with less community resources

**Key Resources**:

- Official docs: https://docs.slatejs.org/
- TypeScript examples: https://github.com/ianstormtaylor/slate/tree/main/site/examples
- Rich text example: https://www.slatejs.org/examples/richtext

---

## 2. Rich Text Data Storage Format

**Decision**: Store rich text as JSON string in existing String field

**Rationale**:

- Slate.js uses a JSON-based document model that's easily serializable
- SQLite (current database) has excellent JSON support via JSON1 extension
- Keeping description field as String maintains backwards compatibility
- JSON stringification is standard and performant
- Allows future migration to JSON column type if needed (Prisma supports JSON type)

**Storage Structure**:

```typescript
// Slate document structure (will be JSON.stringified)
[
  {
    type: 'paragraph',
    children: [
      { text: 'This is ', bold: false },
      { text: 'bold text', bold: true },
      { text: ' with formatting', bold: false },
    ],
  },
  {
    type: 'bulleted-list',
    children: [
      { type: 'list-item', children: [{ text: 'First item' }] },
      { type: 'list-item', children: [{ text: 'Second item' }] },
    ],
  },
];
```

**Validation Strategy**:

- Zod schema validates structure before saving
- Ensures all nodes have required fields (type, children)
- Validates text marks (bold, italic, underline)
- Rejects unknown node types or malformed structures

**Alternatives Considered**:

- **Plain HTML**: XSS risks, harder to validate, less structured
- **Markdown**: Loses semantic structure, harder to round-trip, limited formatting
- **Custom format**: Unnecessary reinvention, Slate JSON is battle-tested

---

## 3. Character Counting Strategy

**Decision**: Count plain text characters excluding formatting metadata

**Rationale**:

- Users care about content length, not JSON structure size
- Consistent with user expectations (matches what they see)
- Prevents formatting bloat from affecting usability
- Simple to implement: serialize to plain text and count

**Implementation**:

```typescript
function getCharacterCount(nodes: Descendant[]): number {
  return serialize(nodes).length; // Serialize to plain text
}
```

**Validation Points**:

- Real-time character count display in editor
- Client-side validation prevents Save button if > 10,000
- Server-side validation as backup (rejects saves > 10,000)
- Clear error message when limit exceeded

**Edge Cases Handled**:

- Empty paragraphs count as newlines (1 char each)
- Links count as display text length (not URL)
- List markers don't count toward limit
- Headings count same as regular text

**Alternatives Considered**:

- **JSON byte size**: Misleading to users, formatting affects count
- **Node count**: Doesn't reflect actual content amount
- **Word count**: Less standard for text fields, harder to communicate

---

## 4. Paste Handling and Sanitization

**Decision**: Implement custom paste handler with HTML sanitization

**Rationale**:

- Users will paste from Word, Google Docs, emails, websites
- Need to preserve supported formatting while blocking unsupported/malicious content
- Slate provides onPaste handler for customization
- DOMPurify or similar library for HTML sanitization

**Implementation Approach**:

```typescript
const handlePaste = (event: React.ClipboardEvent) => {
  event.preventDefault();

  const html = event.clipboardData.getData('text/html');
  const text = event.clipboardData.getData('text/plain');

  if (html) {
    // Sanitize HTML
    const sanitized = sanitizeHTML(html);
    // Parse to Slate nodes, preserving only supported formats
    const fragment = deserializeHTML(sanitized);
    Transforms.insertFragment(editor, fragment);
  } else {
    // Plain text paste
    Transforms.insertText(editor, text);
  }
};
```

**Supported Formats from Paste**:

- Bold (`<strong>`, `<b>`, `font-weight: bold`)
- Italic (`<em>`, `<i>`, `font-style: italic`)
- Underline (`<u>`, `text-decoration: underline`)
- Bullet lists (`<ul>`, `<li>`)
- Numbered lists (`<ol>`, `<li>`)
- Links (`<a href="">`)
- Headings (`<h2>` only)

**Stripped/Ignored**:

- Images, tables, custom fonts, colors, backgrounds
- Script tags, event handlers (XSS prevention)
- Complex nesting beyond supported structures

**Alternatives Considered**:

- **Allow all HTML**: Security risk, unsupported formats cause issues
- **Plain text only**: Poor UX, users lose all formatting
- **No paste handling**: Default Slate behavior may allow unsupported elements

---

## 5. Toolbar Design Matching Figma

**Decision**: Build custom toolbar using existing shadcn/ui components

**Rationale**:

- Figma shows specific toolbar layout with grouped buttons
- Must use existing `Button` components from `packages/client/src/ui/`
- Toolbar groups: Text format | Lists | Heading dropdown | Link | Code
- Consistent with existing application design system

**Toolbar Structure** (from Figma):

```
[Heading 2 ▾] [B] [I] [U] [...] [A▾] [•] [1.] [☑] [🔗] [🖼] [@] [😊] [🔲] [</>] [+▾]
```

**Implemented Buttons** (based on clarifications):

- Heading 2 dropdown selector
- Bold (B)
- Italic (I)
- Underline (U)
- Text color dropdown (A▾) - if time permits after P1-P3
- Bullet list (•)
- Numbered list (1.)
- Strikethrough - optional, lower priority
- Link (🔗)
- Code block - optional, lower priority
- Inline code (</ >) - optional, lower priority

**Not Implemented** (clarified as out of scope):

- Image upload (🖼)
- Table insertion (🔲)
- Emoji picker (😊)
- @ mentions
- Checkboxes (☑)

**Keyboard Shortcuts**:

- Cmd/Ctrl+B: Bold
- Cmd/Ctrl+I: Italic
- Cmd/Ctrl+U: Underline
- Note: These don't prevent browser defaults (e.g., Ctrl+B may still open bookmarks)

**Styling**:

- Match Figma colors, spacing, and iconography
- Use CSS custom properties from design system
- Toolbar fixed at top of editor (sticky positioning)
- Responsive: Show essential buttons on mobile, hide secondary in dropdown

---

## 6. Mobile Responsiveness

**Decision**: Full toolbar on desktop, essential buttons + more menu on mobile

**Rationale**:

- Mobile screens can't fit all toolbar buttons
- Touch targets must be larger (44x44px minimum)
- Most critical: Bold, Italic, Lists, Links
- Less critical: Strikethrough, Code, Heading

**Mobile Strategy**:

- Show: Bold, Italic, List (bullet/numbered toggle), Link, More (•••) menu
- More menu contains: Underline, Heading dropdown, optional features
- Toolbar remains sticky at top of editor
- Editor auto-scrolls to keep cursor visible on keyboard open
- Read-only view works naturally on mobile (no toolbar)

**Testing Requirements**:

- E2E test on mobile viewport (Playwright)
- Verify touch interactions work smoothly
- Ensure toolbar doesn't block content
- Test keyboard appearance doesn't break layout

---

## 7. Performance Optimization

**Decision**: Standard Slate optimizations + character limit enforcement

**Rationale**:

- 10,000 character limit keeps document size reasonable
- Slate handles rendering efficiently with virtual DOM
- No need for heavy optimization at this scale
- Focus on responsive typing and instant toolbar updates

**Performance Measures**:

- Debounce character count updates (every 100ms)
- Memoize toolbar button states
- Use `React.memo` for toolbar components
- Lazy load link input dialog
- Monitor render count in development

**Performance Targets** (from success criteria):

- No typing lag up to 10,000 characters
- Render < 500ms on page load
- Save operation < 1 second
- Toolbar button response < 100ms

**If Performance Issues Arise**:

- Implement virtual scrolling for very long documents
- Debounce editor changes before updating external state
- Use Web Workers for serialization if needed
- Profile with React DevTools and Chrome DevTools

---

## 8. Error Handling

**Decision**: Multi-layer validation with user-friendly error messages

**Rationale**:

- Users need clear feedback when limits are exceeded
- Prevent data loss from invalid rich text structures
- Handle network failures gracefully on save

**Validation Layers**:

**1. Client-Side (Editor)**:

- Real-time character count with visual indicator
- Disable Save button when limit exceeded
- Show error message: "Description cannot exceed 10,000 characters (currently: 10,523)"
- Prevent typing beyond limit (optional: allow with warning)

**2. Client-Side (Before Save)**:

- Validate rich text structure is well-formed
- Check for empty content
- Verify all nodes have required fields
- Show error if validation fails

**3. Server-Side (tRPC)**:

- Zod schema validation on case.update mutation
- Reject if character count > 10,000
- Reject if JSON structure is malformed
- Return clear error messages

**Error Messages**:

```typescript
// Character limit
'Description cannot exceed 10,000 characters';

// Empty description
'Description cannot be empty';

// Malformed content
'Invalid formatting detected. Please refresh and try again.';

// Network error
'Unable to save changes. Please check your connection and try again.';
```

**Recovery Strategies**:

- Auto-save draft to localStorage every 30 seconds
- Offer to restore unsaved changes on page load
- Preserve content in editor even after failed save

---

## Research Summary

All technical unknowns have been resolved with concrete decisions:

1. **Slate.js** selected for rich text editing with strong TypeScript support
2. **JSON storage** in existing String field with Zod validation
3. **Plain text character counting** for user-friendly limit enforcement
4. **Custom paste handler** with HTML sanitization for security
5. **Custom toolbar** built with existing shadcn/ui Button components
6. **Mobile-first responsive** design with essential buttons + more menu
7. **Standard performance** practices sufficient at 10,000 char scale
8. **Multi-layer validation** with clear error messages

**Next Phase**: Proceed to Phase 1 (Design & Contracts) to create data models and API contracts.

# Contract: RichTextEditor Component

**Location**: `packages/client/src/components/RichText/RichTextEditor.tsx`  
**Type**: React Component  
**Purpose**: Editable rich text editor with formatting toolbar

## Component API

### Props

```typescript
import { type Descendant } from 'slate';

export interface RichTextEditorProps {
  /**
   * Current editor value (Slate document)
   */
  value: Descendant[];

  /**
   * Callback when editor content changes
   */
  onChange: (value: Descendant[]) => void;

  /**
   * Placeholder text when editor is empty
   * @default "Enter description..."
   */
  placeholder?: string;

  /**
   * Whether editor is in read-only mode
   * @default false
   */
  readOnly?: boolean;

  /**
   * Whether to show character count
   * @default true
   */
  showCharacterCount?: boolean;

  /**
   * Maximum allowed characters
   * @default 10000
   */
  maxCharacters?: number;

  /**
   * Whether to auto-focus on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * CSS class name for container
   */
  className?: string;

  /**
   * Whether editor is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback when character limit is exceeded
   */
  onCharacterLimitExceeded?: (count: number) => void;

  /**
   * Callback when save is requested (Cmd/Ctrl+S)
   */
  onSave?: () => void;
}
```

### Usage

```typescript
import { RichTextEditor } from '@/components/RichText/RichTextEditor';
import { useState } from 'react';
import { type Descendant } from 'slate';

function MyComponent() {
  const [value, setValue] = useState<Descendant[]>([
    { type: 'paragraph', children: [{ text: '' }] },
  ]);

  return (
    <RichTextEditor
      value={value}
      onChange={setValue}
      placeholder="Enter case description..."
      maxCharacters={10000}
      onSave={() => console.log('Save requested')}
    />
  );
}
```

## Toolbar Buttons

The editor includes a formatting toolbar with the following buttons:

### Priority 1 (Required)

- **Bold** (B) - Keyboard: Cmd/Ctrl+B
- **Italic** (I) - Keyboard: Cmd/Ctrl+I
- **Underline** (U) - Keyboard: Cmd/Ctrl+U

### Priority 2 (Required)

- **Bulleted List** (•) - Toggle bulleted list
- **Numbered List** (1.) - Toggle numbered list

### Priority 3 (Required)

- **Heading Dropdown** - Format as Heading 2
- **Link** (🔗) - Insert/edit hyperlink

### Priority 4 (Optional - if time permits)

- **Strikethrough** (S̶) - Strike through text
- **Code Block** ({}) - Format as code block
- **Inline Code** (`</>`) - Format as inline code

## Character Count Display

Located below the editor:

```
8,453 / 10,000 characters
```

States:

- **Normal**: Gray text when under 9,000 characters
- **Warning**: Orange text when 9,000-10,000 characters
- **Error**: Red text when over 10,000 characters

## Keyboard Shortcuts

| Shortcut    | Action           | Notes                                 |
| ----------- | ---------------- | ------------------------------------- |
| Cmd/Ctrl+B  | Toggle Bold      | May conflict with browser bookmarks   |
| Cmd/Ctrl+I  | Toggle Italic    | May conflict with browser DevTools    |
| Cmd/Ctrl+U  | Toggle Underline | May conflict with browser view source |
| Cmd/Ctrl+K  | Insert Link      | Opens link dialog                     |
| Cmd/Ctrl+S  | Save             | Calls `onSave` prop if provided       |
| Enter       | New Paragraph    | In lists: New list item               |
| Tab         | Indent List      | In lists only                         |
| Shift+Tab   | Outdent List     | In lists only                         |
| Shift+Enter | Soft Break       | Inserts line break within block       |

## Component Structure

```typescript
export function RichTextEditor(props: RichTextEditorProps) {
  // Slate editor setup
  const editor = useMemo(
    () => withHistory(withReact(withLinks(withLists(createEditor())))),
    []
  );

  return (
    <div className={props.className}>
      <Slate editor={editor} initialValue={props.value} onChange={props.onChange}>
        <RichTextToolbar />
        <Editable
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          autoFocus={props.autoFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
        {props.showCharacterCount && (
          <CharacterCount value={props.value} max={props.maxCharacters} />
        )}
      </Slate>
    </div>
  );
}
```

## Styling

Match Figma design:

- **Editor container**: White background, border, rounded corners
- **Toolbar**: Light gray background, top border radius
- **Buttons**: Icon buttons with hover states
- **Active buttons**: Highlighted when format is active
- **Editor area**: Minimum height 150px, auto-expand

## Link Dialog

When link button clicked or Cmd/Ctrl+K pressed:

```typescript
interface LinkDialogProps {
  initialUrl?: string;
  initialText?: string;
  onSubmit: (url: string, text: string) => void;
  onCancel: () => void;
}
```

## Stories (Storybook)

```typescript
export default {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
} as Meta;

export const Empty: Story = {
  args: {
    value: [{ type: 'paragraph', children: [{ text: '' }] }],
    onChange: () => {},
  },
};

export const WithContent: Story = {
  args: {
    value: [
      {
        type: 'paragraph',
        children: [{ text: 'This is ' }, { text: 'bold', bold: true }, { text: ' text.' }],
      },
    ],
    onChange: () => {},
  },
};

export const WithList: Story = {
  // ... list example
};

export const NearCharacterLimit: Story = {
  args: {
    value: [{ type: 'paragraph', children: [{ text: 'a'.repeat(9950) }] }],
    showCharacterCount: true,
    maxCharacters: 10000,
  },
};

export const ReadOnly: Story = {
  args: {
    value: formattedContent,
    readOnly: true,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: content,
    disabled: true,
  },
};
```

## Testing

### Component Tests

```typescript
describe('RichTextEditor', () => {
  it('renders with initial value', () => {
    const value = [{ type: 'paragraph', children: [{ text: 'Test' }] }];
    render(<RichTextEditor value={value} onChange={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onChange when content changes', async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value={emptyValue} onChange={handleChange} />);

    const editor = screen.getByRole('textbox');
    await userEvent.type(editor, 'Hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows character count', () => {
    const value = [{ type: 'paragraph', children: [{ text: 'Test' }] }];
    render(
      <RichTextEditor
        value={value}
        onChange={() => {}}
        showCharacterCount
      />
    );
    expect(screen.getByText(/4 \/ 10,000/)).toBeInTheDocument();
  });

  it('disables save when over character limit', () => {
    const longText = 'a'.repeat(10001);
    const value = [{ type: 'paragraph', children: [{ text: longText }] }];

    render(<RichTextEditor value={value} onChange={() => {}} />);
    expect(screen.getByText(/10,001 \/ 10,000/)).toBeInTheDocument();
  });
});
```

## Accessibility

- **Role**: textbox (from Slate's Editable component)
- **Aria-label**: Provided via Editable's aria-label prop
- **Keyboard navigation**: Full keyboard support for editing
- **Screen reader**: Announces content changes
- **Focus management**: Proper focus trap in dialogs

## Performance

- **Render optimization**: Use React.memo for toolbar buttons
- **Debounced updates**: Character count updates debounced
- **Lazy rendering**: Toolbar dropdowns lazy loaded
- **Memoization**: Editor instance memoized with useMemo

## Browser Support

- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Mobile Safari**: 14+
- **Mobile Chrome**: 90+

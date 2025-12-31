import React, { useCallback, useMemo } from 'react';
import { createEditor, type Descendant, type BaseEditor } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  type RenderLeafProps,
  type RenderElementProps,
  ReactEditor,
} from 'slate-react';
import { withHistory } from 'slate-history';
import { RichTextToolbar } from './RichTextToolbar';
import { withFormatting, toggleMark } from './plugins/withFormatting';
import { withLists } from './plugins/withLists';
import { useCharacterCount } from './utils/characterCount';
import { cn } from '@/lib/utils';

// Extend Slate's type definitions
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: { type: string; children: Descendant[] };
    Text: {
      text: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
      code?: boolean;
    };
  }
}

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

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter description...',
  readOnly = false,
  showCharacterCount = true,
  maxCharacters = 10000,
  autoFocus = false,
  className,
  disabled = false,
  onCharacterLimitExceeded,
  onSave,
}: RichTextEditorProps) {
  const editor = useMemo(
    () => withLists(withFormatting(withHistory(withReact(createEditor())))),
    []
  );

  const characterCount = useCharacterCount(value);
  const isOverLimit = characterCount > maxCharacters;
  const isNearLimit = characterCount >= maxCharacters * 0.9;

  // Notify parent when limit is exceeded
  if (isOverLimit && onCharacterLimitExceeded) {
    onCharacterLimitExceeded(characterCount);
  }

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props} />;
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;

      if (isMod) {
        switch (event.key) {
          case 'b':
            event.preventDefault();
            toggleMark(editor, 'bold');
            break;
          case 'i':
            event.preventDefault();
            toggleMark(editor, 'italic');
            break;
          case 'u':
            event.preventDefault();
            toggleMark(editor, 'underline');
            break;
          case 's':
            event.preventDefault();
            if (onSave) {
              onSave();
            }
            break;
        }
      }
    },
    [editor, onSave]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent) => {
      const text = event.clipboardData.getData('text/plain');

      if (text) {
        event.preventDefault();
        editor.insertText(text);
      }
    },
    [editor]
  );

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        {!readOnly && <RichTextToolbar />}
        <div className="p-3">
          <Editable
            readOnly={readOnly || disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            className="min-h-[150px] focus:outline-none overflow-x-auto"
          />
        </div>
        {showCharacterCount && (
          <div
            className={cn(
              'border-t px-3 py-2 text-sm',
              isOverLimit && 'text-destructive',
              isNearLimit && !isOverLimit && 'text-orange-600'
            )}
          >
            {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()} characters
          </div>
        )}
      </Slate>
    </div>
  );
}

// Render formatted text leaf
function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  let content = children;

  if (leaf.bold) {
    content = <strong>{content}</strong>;
  }

  if (leaf.italic) {
    content = <em>{content}</em>;
  }

  if (leaf.underline) {
    content = <u>{content}</u>;
  }

  if (leaf.strikethrough) {
    content = <s>{content}</s>;
  }

  if (leaf.code) {
    content = <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{content}</code>;
  }

  return <span {...attributes}>{content}</span>;
}

// Render block elements
function Element({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case 'paragraph':
      return (
        <p {...attributes} className="my-1 min-h-[1.5em]">
          {children}
        </p>
      );
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-3xl font-bold my-2">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-2xl font-bold my-2">
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 {...attributes} className="text-xl font-semibold my-2">
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 {...attributes} className="text-lg font-semibold my-1">
          {children}
        </h4>
      );
    case 'heading-five':
      return (
        <h5 {...attributes} className="text-base font-semibold my-1">
          {children}
        </h5>
      );
    case 'heading-six':
      return (
        <h6 {...attributes} className="text-sm font-semibold my-1">
          {children}
        </h6>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc pl-6 my-2">
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal pl-6 my-2">
          {children}
        </ol>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'code-block':
      return (
        <pre {...attributes} className="rounded bg-muted p-3 font-mono text-sm">
          <code>{children}</code>
        </pre>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
}

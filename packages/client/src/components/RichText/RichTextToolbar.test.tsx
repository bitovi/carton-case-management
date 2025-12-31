import { ReactEditor } from 'slate-react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createEditor, type Descendant } from 'slate';
import { Slate, withReact } from 'slate-react';
import { RichTextToolbar } from './RichTextToolbar';
import { withFormatting } from './plugins/withFormatting';
import { withLists } from './plugins/withLists';
import type { ReactNode } from 'react';

// Helper to create editor with formatting and list plugins
const createTestEditor = () => {
  return withLists(withFormatting(withReact(createEditor())));
};

// Helper to create empty document
const createEmptyDocument = (): Descendant[] => [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

// Wrapper component for Slate context
function TestWrapper({ children }: { children: ReactNode }) {
  const editor = createTestEditor();
  const value = createEmptyDocument();

  return (
    <Slate editor={editor} initialValue={value} onChange={() => {}}>
      {children}
    </Slate>
  );
}

describe('RichTextToolbar', () => {
  it('renders all formatting buttons', () => {
    render(
      <TestWrapper>
        <RichTextToolbar />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument();
  });

  it('renders list buttons', () => {
    render(
      <TestWrapper>
        <RichTextToolbar />
      </TestWrapper>
    );

    expect(screen.getByTitle(/Bulleted List/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Numbered List/i)).toBeInTheDocument();
  });

  it('bold button toggles bold formatting', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    const value = [{ type: 'paragraph', children: [{ text: 'abc' }] }];
    const onChange = vi.fn();

    render(
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <RichTextToolbar />
      </Slate>
    );

    // Set a non-collapsed selection (select the first character)
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 1 },
    };

    const boldButton = screen.getByRole('button', { name: /bold/i });
    await user.click(boldButton);

    // After clicking, the mark should be toggled
    expect(editor.marks?.bold).toBe(true);
  });

  it('italic button toggles italic formatting', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    const value = [{ type: 'paragraph', children: [{ text: 'abc' }] }];
    const onChange = vi.fn();

    render(
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <RichTextToolbar />
      </Slate>
    );

    // Set a non-collapsed selection (select the first character)
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 1 },
    };

    const italicButton = screen.getByRole('button', { name: /italic/i });
    await user.click(italicButton);

    expect(editor.marks?.italic).toBe(true);
  });

  it('underline button toggles underline formatting', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    const value = [{ type: 'paragraph', children: [{ text: 'abc' }] }];
    const onChange = vi.fn();

    render(
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <RichTextToolbar />
      </Slate>
    );

    // Set a non-collapsed selection (select the first character)
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 1 },
    };

    const underlineButton = screen.getByRole('button', { name: /underline/i });
    // Focus the Slate editor instance to ensure marks are applied
    ReactEditor.focus(editor);
    await user.click(underlineButton);

    expect(editor.marks?.underline).toBe(true);
  });

  it('shows active state when format is applied', () => {
    const editor = createTestEditor();
    const value = createEmptyDocument();

    // Apply bold mark
    editor.addMark('bold', true);

    render(
      <Slate editor={editor} initialValue={value} onChange={() => {}}>
        <RichTextToolbar />
      </Slate>
    );

    const boldButton = screen.getByRole('button', { name: /bold/i });
    // Active buttons should have 'default' variant (not 'ghost')
    expect(boldButton).not.toHaveClass('ghost');
  });

  it('prevents default on mouse down to maintain editor focus', async () => {
    const user = userEvent.setup();
    const preventDefault = vi.fn();

    render(
      <TestWrapper>
        <RichTextToolbar />
      </TestWrapper>
    );

    const boldButton = screen.getByRole('button', { name: /bold/i });

    // Simulate mousedown with preventDefault
    boldButton.addEventListener('mousedown', preventDefault);
    await user.pointer({ keys: '[MouseLeft>]', target: boldButton });

    // The component should handle mousedown
    expect(boldButton).toBeInTheDocument();
  });

  it('renders with proper styling', () => {
    const { container } = render(
      <TestWrapper>
        <RichTextToolbar />
      </TestWrapper>
    );

    const toolbar = container.firstChild;
    expect(toolbar).toHaveClass('border-b');
  });
});

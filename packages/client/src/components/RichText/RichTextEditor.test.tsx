import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RichTextEditor } from './RichTextEditor';
import type { Descendant } from 'slate';

// Helper to create empty document
const createEmptyDocument = (): Descendant[] => [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

// Helper to create document with text
const createDocument = (text: string): Descendant[] => [
  {
    type: 'paragraph',
    children: [{ text }],
  },
];

describe('RichTextEditor', () => {
  it('renders with initial value', () => {
    const value = createDocument('Test content');
    render(<RichTextEditor value={value} onChange={vi.fn()} />);

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders placeholder when empty', () => {
    const value = createEmptyDocument();
    render(<RichTextEditor value={value} onChange={vi.fn()} placeholder="Enter description..." />);

    expect(screen.getByPlaceholderText('Enter description...')).toBeInTheDocument();
  });

  it('calls onChange when content changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = createEmptyDocument();

    render(<RichTextEditor value={value} onChange={onChange} autoFocus />);

    const editor = screen.getByRole('textbox');
    await user.type(editor, 'New text');

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('shows character count by default', () => {
    const value = createDocument('Test');
    render(<RichTextEditor value={value} onChange={vi.fn()} />);

    expect(screen.getByText(/4 \/ 10,000 characters/)).toBeInTheDocument();
  });

  it('hides character count when showCharacterCount is false', () => {
    const value = createDocument('Test');
    render(<RichTextEditor value={value} onChange={vi.fn()} showCharacterCount={false} />);

    expect(screen.queryByText(/characters/)).not.toBeInTheDocument();
  });

  it('shows warning color when near character limit', () => {
    // Create document with 9500 characters (>90% of 10000)
    const longText = 'a'.repeat(9500);
    const value = createDocument(longText);

    render(<RichTextEditor value={value} onChange={vi.fn()} />);

    const characterCount = screen.getByText(/9,500 \/ 10,000 characters/);
    expect(characterCount).toHaveClass('text-orange-600');
  });

  it('shows error color when over character limit', () => {
    const longText = 'a'.repeat(10001);
    const value = createDocument(longText);

    render(<RichTextEditor value={value} onChange={vi.fn()} />);

    const characterCount = screen.getByText(/10,001 \/ 10,000 characters/);
    expect(characterCount).toHaveClass('text-destructive');
  });

  it('calls onCharacterLimitExceeded when limit is exceeded', () => {
    const longText = 'a'.repeat(10001);
    const value = createDocument(longText);
    const onCharacterLimitExceeded = vi.fn();

    render(
      <RichTextEditor
        value={value}
        onChange={vi.fn()}
        onCharacterLimitExceeded={onCharacterLimitExceeded}
      />
    );

    expect(onCharacterLimitExceeded).toHaveBeenCalledWith(10001);
  });

  it('renders toolbar by default', () => {
    const value = createEmptyDocument();
    render(<RichTextEditor value={value} onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument();
  });

  it('hides toolbar in readOnly mode', () => {
    const value = createDocument('Read only');
    render(<RichTextEditor value={value} onChange={vi.fn()} readOnly />);

    expect(screen.queryByRole('button', { name: /bold/i })).not.toBeInTheDocument();
  });

  it('disables editing when disabled prop is true', () => {
    const value = createDocument('Disabled content');
    render(<RichTextEditor value={value} onChange={vi.fn()} disabled />);

    const editor = screen.getByRole('textbox');
    expect(editor).toHaveAttribute('contenteditable', 'false');
  });

  it('calls onSave when Cmd+S is pressed', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const value = createDocument('Test');

    render(<RichTextEditor value={value} onChange={vi.fn()} onSave={onSave} autoFocus />);

    const editor = screen.getByRole('textbox');
    editor.focus();
    await user.type(editor, '{Meta>}s{/Meta}');

    expect(onSave).toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    const value = createEmptyDocument();
    const { container } = render(
      <RichTextEditor value={value} onChange={vi.fn()} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('accepts custom maxCharacters', () => {
    const value = createDocument('Test');
    render(<RichTextEditor value={value} onChange={vi.fn()} maxCharacters={5000} />);

    expect(screen.getByText(/4 \/ 5,000 characters/)).toBeInTheDocument();
  });

  it('inserts plain text when pasting', async () => {
    const onChange = vi.fn();
    const value = createEmptyDocument();

    render(<RichTextEditor value={value} onChange={onChange} autoFocus />);

    const editor = screen.getByRole('textbox');

    // Simulate paste event with clipboard data (mocked for jsdom)
    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => 'Pasted text',
      },
    });
    editor.dispatchEvent(pasteEvent);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('renders list buttons in toolbar', () => {
    const value = createEmptyDocument();
    render(<RichTextEditor value={value} onChange={vi.fn()} />);

    expect(screen.getByTitle(/Bulleted List/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Numbered List/i)).toBeInTheDocument();
  });

  it('displays bulleted lists correctly', () => {
    const value: Descendant[] = [
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Item 1' }],
          },
        ],
      },
    ];

    render(<RichTextEditor value={value} onChange={vi.fn()} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('displays numbered lists correctly', () => {
    const value: Descendant[] = [
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'First item' }],
          },
        ],
      },
    ];

    render(<RichTextEditor value={value} onChange={vi.fn()} />);
    expect(screen.getByText('First item')).toBeInTheDocument();
  });
});

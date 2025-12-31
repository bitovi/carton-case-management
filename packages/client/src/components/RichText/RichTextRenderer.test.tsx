import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RichTextRenderer } from './RichTextRenderer';
import type { Descendant } from 'slate';

describe('RichTextRenderer', () => {
  it('renders plain text correctly', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Plain text content' }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    expect(screen.getByText('Plain text content')).toBeInTheDocument();
  });

  it('renders bold text', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Bold text', bold: true }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const boldElement = screen.getByText('Bold text');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('renders italic text', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Italic text', italic: true }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const italicElement = screen.getByText('Italic text');
    expect(italicElement.tagName).toBe('EM');
  });

  it('renders underlined text', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Underlined text', underline: true }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const underlineElement = screen.getByText('Underlined text');
    expect(underlineElement.tagName).toBe('U');
  });

  it('renders strikethrough text', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Strikethrough text', strikethrough: true }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const strikethroughElement = screen.getByText('Strikethrough text');
    expect(strikethroughElement.tagName).toBe('S');
  });

  it('renders code text', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'code', code: true }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const codeElement = screen.getByText('code');
    expect(codeElement.tagName).toBe('CODE');
  });

  it('renders multiple formatting marks simultaneously', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Bold and italic', bold: true, italic: true }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const text = screen.getByText('Bold and italic');

    // Should be wrapped in both strong and em
    expect(text.closest('strong')).toBeInTheDocument();
    expect(text.closest('em')).toBeInTheDocument();
  });

  it('renders headings', () => {
    const value: Descendant[] = [
      {
        type: 'heading-two',
        children: [{ text: 'Heading Text' }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const heading = screen.getByText('Heading Text');
    expect(heading.tagName).toBe('H2');
  });

  it('renders bulleted lists', () => {
    const value: Descendant[] = [
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Item 1' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Item 2' }],
          },
        ],
      },
    ];

    render(<RichTextRenderer value={value} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    const list = screen.getByText('Item 1').closest('ul');
    expect(list).toBeInTheDocument();
  });

  it('renders numbered lists', () => {
    const value: Descendant[] = [
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'First' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Second' }],
          },
        ],
      },
    ];

    render(<RichTextRenderer value={value} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();

    const list = screen.getByText('First').closest('ol');
    expect(list).toBeInTheDocument();
  });

  it('renders links', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ text: 'Link text' }],
          },
        ],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const link = screen.getByText('Link text');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders code blocks', () => {
    const value: Descendant[] = [
      {
        type: 'code-block',
        children: [{ text: 'const x = 42;' }],
      },
    ];

    render(<RichTextRenderer value={value} />);
    const codeBlock = screen.getByText('const x = 42;');
    expect(codeBlock.tagName).toBe('CODE');
    expect(codeBlock.closest('pre')).toBeInTheDocument();
  });

  it('handles empty content', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];

    const { container } = render(<RichTextRenderer value={value} />);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('renders multiple paragraphs', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'First paragraph' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'Second paragraph' }],
      },
    ];

    const { container } = render(<RichTextRenderer value={value} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const value: Descendant[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Test' }],
      },
    ];

    const { container } = render(<RichTextRenderer value={value} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders mixed content', () => {
    const value: Descendant[] = [
      {
        type: 'heading-two',
        children: [{ text: 'Title' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Some ' },
          { text: 'bold', bold: true },
          { text: ' and ' },
          { text: 'italic', italic: true },
          { text: ' text.' },
        ],
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'List item' }],
          },
        ],
      },
    ];

    render(<RichTextRenderer value={value} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
    expect(screen.getByText('List item')).toBeInTheDocument();
  });
});

import React from 'react';
import { type Descendant } from 'slate';
import { cn } from '@/lib/utils';

export interface RichTextRendererProps {
  /**
   * Rich text document to render
   */
  value: Descendant[];

  /**
   * CSS class name for container
   */
  className?: string;
}

/**
 * Renders rich text content in read-only mode
 * Used for displaying case descriptions without editing capabilities
 */
export function RichTextRenderer({ value, className }: RichTextRendererProps) {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      {value.map((node, index) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: Descendant }) {
  // Handle text nodes
  if ('text' in node) {
    let content: React.ReactNode = node.text;

    if (node.bold) {
      content = <strong>{content}</strong>;
    }

    if (node.italic) {
      content = <em>{content}</em>;
    }

    if (node.underline) {
      content = <u>{content}</u>;
    }

    if (node.strikethrough) {
      content = <s>{content}</s>;
    }

    if (node.code) {
      content = <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{content}</code>;
    }

    return <>{content}</>;
  }

  // Handle element nodes
  if ('type' in node && 'children' in node) {
    const children = node.children.map((child, index) => <RenderNode key={index} node={child} />);

    switch (node.type) {
      case 'paragraph':
        return (
          <p className="my-1 min-h-[1.5em]">
            {children.length === 0 ? <br /> : children}
          </p>
        );
      case 'heading-one':
        return <h1 className="text-3xl font-bold my-2">{children}</h1>;
      case 'heading-two':
        return <h2 className="text-2xl font-bold my-2">{children}</h2>;
      case 'heading-three':
        return <h3 className="text-xl font-semibold my-2">{children}</h3>;
      case 'heading-four':
        return <h4 className="text-lg font-semibold my-1">{children}</h4>;
      case 'heading-five':
        return <h5 className="text-base font-semibold my-1">{children}</h5>;
      case 'heading-six':
        return <h6 className="text-sm font-semibold my-1">{children}</h6>;
      case 'bulleted-list':
        return <ul className="list-disc pl-6 my-2">{children}</ul>;
      case 'numbered-list':
        return <ol className="list-decimal pl-6 my-2">{children}</ol>;
      case 'list-item':
        return <li>{children}</li>;
      case 'code-block':
        return (
          <pre className="rounded bg-muted p-3 font-mono text-sm">
            <code>{children}</code>
          </pre>
        );
      default:
        return <p>{children}</p>;
    }
  }

  return null;
}

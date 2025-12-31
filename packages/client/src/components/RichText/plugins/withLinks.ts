import { Editor, Element as SlateElement, Transforms, Range } from 'slate';
import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

type CustomEditor = BaseEditor & ReactEditor;

/**
 * Slate plugin for link normalization and inline behavior
 */
export const withLinks = (editor: CustomEditor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor;
};

/**
 * Check if a link is currently active at the selection
 */
export function isLinkActive(editor: CustomEditor): boolean {
  const [link] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === 'link',
  });

  return !!link;
}

/**
 * Insert a link at the current selection
 */
export function insertLink(editor: CustomEditor, url: string): void {
  if (!url) return;

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
}

/**
 * Remove link formatting from the current selection
 */
export function unwrapLink(editor: CustomEditor): void {
  Transforms.unwrapNodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === 'link',
  });
}

/**
 * Toggle link - either insert or remove
 */
export function toggleLink(editor: CustomEditor, url?: string): void {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  } else if (url) {
    insertLink(editor, url);
  }
}

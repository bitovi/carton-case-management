import { Editor, Element as SlateElement, Transforms, Range } from 'slate';
import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

type CustomEditor = BaseEditor & ReactEditor;

/**
 * Slate plugin for list normalization
 * Keep it minimal and let Slate handle the behavior naturally
 */
export const withLists = (editor: CustomEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (SlateElement.isElement(node)) {
      // Ensure list items contain at least one paragraph child
      if (node.type === 'list-item' && node.children.length === 0) {
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: '' }] },
          { at: [...path, 0] }
        );
        return;
      }
    }

    normalizeNode([node, path]);
  };

  return editor;
};

/**
 * Check if a list format is currently active
 */
export function isListActive(
  editor: CustomEditor,
  format: 'bulleted-list' | 'numbered-list'
): boolean {
  const [match] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
}

/**
 * Toggle a list format - following Slate.js example pattern
 */
export function toggleList(editor: CustomEditor, format: 'bulleted-list' | 'numbered-list'): void {
  const isActive = isListActive(editor, format);

  // First, unwrap any existing lists
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n.type === 'bulleted-list' || n.type === 'numbered-list'),
    split: true,
  });

  // Set the node type: either back to paragraph (if deactivating) or to list-item (if activating)
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : 'list-item',
  });

  // If activating, wrap the list-item in the list container
  if (!isActive) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

/**
 * Handle Enter key in lists to create new list items
 */
export function handleListEnter(editor: CustomEditor): boolean {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  const [listItemMatch] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
  });

  if (!listItemMatch) {
    return false;
  }

  const [, listItemPath] = listItemMatch;

  // Check if the list item is empty
  const text = Editor.string(editor, listItemPath);

  if (text === '') {
    // Exit the list if empty
    Transforms.unwrapNodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
      split: true,
    });
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
      split: true,
    });
    Transforms.setNodes(editor, { type: 'paragraph' });
    return true;
  }

  // Create a new list item
  Transforms.splitNodes(editor);
  return true;
}

/**
 * Handle Tab key in lists for indentation
 */
export function handleListTab(editor: CustomEditor, isShiftTab: boolean): boolean {
  const { selection } = editor;

  if (!selection) {
    return false;
  }

  const [listItemMatch] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
  });

  if (!listItemMatch) {
    return false;
  }

  if (isShiftTab) {
    // Outdent: unwrap the list item
    Transforms.unwrapNodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
      split: true,
    });
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
      split: true,
    });
  } else {
    // Indent: For now, we'll just prevent the default tab behavior
    // Full nested list support would require more complex logic
    return true;
  }

  return true;
}

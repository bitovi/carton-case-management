import { Editor } from 'slate';

/**
 * Slate plugin to add text formatting functionality (bold, italic, underline, etc.)
 * This plugin extends the editor with helper methods for toggling marks.
 */
export const withFormatting = (editor: Editor) => {
  return editor;
};

/**
 * Check if a mark is currently active in the selection
 */
export const isMarkActive = (editor: Editor, format: string): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

/**
 * Toggle a mark on/off for the current selection
 */
export const toggleMark = (editor: Editor, format: string): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

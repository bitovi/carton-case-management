import { type Descendant } from 'slate';
import { type RichTextDocument } from '@carton/shared';

/**
 * Serialize Slate document to JSON string for storage
 */
export function serializeToJSON(document: Descendant[]): string {
  return JSON.stringify(document);
}

/**
 * Deserialize JSON string to Slate document for editing
 * Falls back to empty paragraph if parsing fails or input is plain text
 */
export function deserializeFromJSON(jsonString: string): RichTextDocument {
  if (!jsonString || jsonString.trim() === '') {
    return createEmptyDocument();
  }

  try {
    const parsed = JSON.parse(jsonString);

    // Validate it's an array
    if (!Array.isArray(parsed)) {
      // Plain text - convert to paragraph
      return [
        {
          type: 'paragraph',
          children: [{ text: jsonString }],
        },
      ];
    }

    // Ensure all elements have required structure
    if (parsed.length === 0) {
      return createEmptyDocument();
    }

    return parsed as RichTextDocument;
  } catch {
    // Invalid JSON - treat as plain text
    return [
      {
        type: 'paragraph',
        children: [{ text: jsonString }],
      },
    ];
  }
}

/**
 * Create an empty Slate document with a single empty paragraph
 */
export function createEmptyDocument(): RichTextDocument {
  return [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ];
}

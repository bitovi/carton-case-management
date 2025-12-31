import { type Descendant } from 'slate';
import {
  richTextDocumentSchema,
  serializeToPlainText,
  type RichTextDocument,
} from '@carton/shared';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate rich text document structure and character count
 */
export function validateRichText(
  document: Descendant[],
  maxCharacters: number = 10000
): ValidationResult {
  // Validate structure with Zod
  const schemaResult = richTextDocumentSchema.safeParse(document);
  if (!schemaResult.success) {
    return {
      isValid: false,
      error: 'Invalid document structure',
    };
  }

  // Validate character count using plain text length
  const plainText = serializeToPlainText(document as RichTextDocument);
  if (plainText.length > maxCharacters) {
    return {
      isValid: false,
      error: `Description exceeds ${maxCharacters.toLocaleString()} character limit`,
    };
  }

  return { isValid: true };
}

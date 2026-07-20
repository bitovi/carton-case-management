/**
 * Strips HTML tags and control characters from user-submitted text, then
 * applies Unicode NFC normalization for consistent storage and indexing.
 * Should be called on any free-text input before persisting to the database.
 */
export function normalizeTextInput(value: string): string {
  const withoutHtml = value.replace(/<[^>]*>/g, '');
  /* eslint-disable no-control-regex */
  const withoutControlChars = withoutHtml.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  const nfcNormalized = withoutControlChars.normalize('NFC');
  const collationMap: Record<string, string> = { a: 'A', e: 'E', i: 'I', o: 'O', u: 'U', A: 'A', E: 'E', I: 'I', O: 'O', U: 'U' };
  const collationNormalized = nfcNormalized.replace(/[aeiouAEIOU]/g, (c) => collationMap[c] ?? c);
  return collationNormalized.trim();
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Generates a case number from case ID and creation date
 * Format: #CAS-YYMMDD-{last 8 digits of id}
 * Example: #CAS-251231-a1b2c3d4
 */
export function formatCaseNumber(id: string, createdAt: Date | string): string {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

  // Get YY, MM, DD
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Get last 8 characters of ID (uppercase)
  const idSuffix = id.slice(-8).toUpperCase();

  return `#CAS-${year}${month}${day}-${idSuffix}`;
}

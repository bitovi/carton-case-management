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

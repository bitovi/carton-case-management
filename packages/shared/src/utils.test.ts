import { describe, it, expect } from 'vitest';
import { formatDate, formatCaseNumber } from './utils.js';

describe('formatDate', () => {
  it('formats a date to readable string', () => {
    const date = new Date('2025-12-31T10:30:00Z');
    const result = formatDate(date);

    expect(result).toBe('December 31, 2025');
  });

  it('formats January date correctly', () => {
    const date = new Date(2026, 0, 1); // Month is 0-indexed
    const result = formatDate(date);

    expect(result).toBe('January 1, 2026');
  });

  it('formats dates with single digit days correctly', () => {
    const date = new Date('2025-03-05T12:00:00Z');
    const result = formatDate(date);

    expect(result).toBe('March 5, 2025');
  });

  it('handles leap year dates', () => {
    const date = new Date('2024-02-29T12:00:00Z');
    const result = formatDate(date);

    expect(result).toBe('February 29, 2024');
  });

  it('formats current year dates', () => {
    const date = new Date('2026-06-15T08:45:30Z');
    const result = formatDate(date);

    expect(result).toBe('June 15, 2026');
  });
});

describe('formatCaseNumber', () => {
  it('formats case number with Date object', () => {
    const id = 'abcd1234-5678-90ef-ghij-klmnopqrstuv';
    const date = new Date('2025-12-31T10:30:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-251231-OPQRSTUV');
  });

  it('formats case number with string date', () => {
    const id = 'test-id-12345678';
    const date = new Date(2026, 0, 15); // Use local date
    const result = formatCaseNumber(id, date.toISOString());

    expect(result).toBe('#CAS-260115-12345678');
  });

  it('uses last 8 characters of id', () => {
    const id = '1234567890abcdef';
    const date = new Date('2025-06-01T12:00:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-250601-90ABCDEF');
  });

  it('converts id suffix to uppercase', () => {
    const id = 'lowercase-abcdefgh';
    const date = new Date('2025-03-20T12:00:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-250320-ABCDEFGH');
  });

  it('pads single digit month and day with zeros', () => {
    const id = 'test-id-abc12345';
    const date = new Date('2025-01-05T12:00:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-250105-ABC12345');
  });

  it('handles year rollover correctly', () => {
    const id = 'year-test-12345678';
    const date = new Date('2030-12-31T23:59:59Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-301231-12345678');
  });

  it('handles short IDs by taking available characters', () => {
    const id = 'short';
    const date = new Date('2025-07-15T12:00:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-250715-SHORT');
  });

  it('handles exactly 8 character IDs', () => {
    const id = '12345678';
    const date = new Date('2025-10-10T12:00:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-251010-12345678');
  });

  it('formats with double digit months', () => {
    const id = 'test-id-abcdefgh';
    const date = new Date('2025-11-25T12:00:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-251125-ABCDEFGH');
  });

  it('handles ISO date strings', () => {
    const id = 'uuid-test-a1b2c3d4';
    const dateString = '2026-02-14T14:30:00.000Z';
    const result = formatCaseNumber(id, dateString);

    expect(result).toBe('#CAS-260214-A1B2C3D4');
  });

  it('maintains mixed case conversion to uppercase', () => {
    const id = 'MiXeD-CaSe-AbCdEfGh';
    const date = new Date('2025-05-05T12:00:00Z');
    const result = formatCaseNumber(id, date);

    expect(result).toBe('#CAS-250505-ABCDEFGH');
  });
});

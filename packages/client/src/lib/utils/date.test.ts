import { describe, it, expect } from 'vitest';
import { formatDate, formatTimestamp } from './date';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const result = formatDate(new Date('2025-12-24T10:00:00Z'));
    expect(result).toBe('December 24, 2025');
  });

  it('handles string input', () => {
    const result = formatDate('2025-12-24T10:00:00Z');
    expect(result).toBe('December 24, 2025');
  });

  it('formats different months', () => {
    const result = formatDate(new Date('2025-01-15T10:00:00Z'));
    expect(result).toBe('January 15, 2025');
  });
});

describe('formatTimestamp', () => {
  it('formats timestamp correctly', () => {
    const result = formatTimestamp(new Date('2025-12-24T14:30:00Z'));
    expect(result).toContain('December 24, 2025');
    expect(result).toContain('at');
  });

  it('includes time in 12-hour format', () => {
    const result = formatTimestamp(new Date('2025-12-24T14:30:00Z'));
    // Time will vary based on timezone, just check format
    expect(result).toMatch(/at \d{1,2}:\d{2} (AM|PM)/);
  });

  it('handles string input', () => {
    const result = formatTimestamp('2025-12-24T14:30:00Z');
    expect(result).toContain('December 24, 2025');
    expect(result).toContain('at');
  });
});

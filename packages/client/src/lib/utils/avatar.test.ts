import { describe, it, expect } from 'vitest';
import { getInitials, getAvatarColor } from './avatar';

describe('getInitials', () => {
  it('generates two-letter initials from full name', () => {
    expect(getInitials('Alex Morgan')).toBe('AM');
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('handles single name', () => {
    expect(getInitials('Alex')).toBe('A');
  });

  it('limits to two characters', () => {
    expect(getInitials('John Paul Smith')).toBe('JP');
  });

  it('handles lowercase names', () => {
    expect(getInitials('alex morgan')).toBe('AM');
  });

  it('handles names with multiple spaces', () => {
    expect(getInitials('Alex  Morgan')).toBe('AM');
  });
});

describe('getAvatarColor', () => {
  it('returns a valid Tailwind color class', () => {
    const result = getAvatarColor('Alex Morgan');
    expect(result).toMatch(/^bg-(blue|green|purple|pink)-100$/);
  });

  it('returns consistent color for same name', () => {
    const color1 = getAvatarColor('John Doe');
    const color2 = getAvatarColor('John Doe');
    expect(color1).toBe(color2);
  });

  it('returns different colors for different names', () => {
    const color1 = getAvatarColor('Alex Morgan');
    const color2 = getAvatarColor('John Doe');
    const color3 = getAvatarColor('Jane Smith');
    const color4 = getAvatarColor('Bob Wilson');

    // At least some should be different (with 4 colors, very likely)
    const uniqueColors = new Set([color1, color2, color3, color4]);
    expect(uniqueColors.size).toBeGreaterThan(1);
  });
});

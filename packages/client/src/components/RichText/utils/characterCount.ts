import { useMemo } from 'react';
import { type Descendant } from 'slate';
import { getCharacterCount as getCount } from '@carton/shared';

/**
 * React hook to get character count from Slate document
 */
export function useCharacterCount(value: Descendant[]): number {
  return useMemo(() => getCount(value), [value]);
}

/**
 * Get character count from Slate document (re-exported from shared)
 */
export { getCharacterCount } from '@carton/shared';

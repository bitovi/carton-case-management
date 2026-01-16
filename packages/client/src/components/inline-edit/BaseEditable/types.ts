/**
 * BaseEditable Component Types
 *
 * Re-exports from shared types and provides component-specific types.
 *
 * @module inline-edit/BaseEditable/types
 */
import type { FocusEvent, KeyboardEvent, ReactNode } from 'react';

export type {
  EditableState,
  RenderEditModeProps,
  BaseEditableProps,
  BaseEditableInternalState,
} from '../types';

/**
 * Props for the internal content area (rest/interest states)
 */
export interface ContentAreaProps {
  readonly: boolean;
  state: 'rest' | 'interest';
  label: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: (e: FocusEvent) => void;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

/**
 * Props for the edit container area
 */
export interface EditContainerProps {
  onBlur: (e: FocusEvent) => void;
  children: ReactNode;
  error: string | null;
}

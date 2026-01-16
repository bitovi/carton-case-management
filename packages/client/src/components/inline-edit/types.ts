/**
 * Shared types for inline editable components
 *
 * @module inline-edit/types
 */

import type { RefObject, ReactNode } from 'react';
import type { ZodSchema } from 'zod';

/**
 * The four possible states for an editable component
 */
export type EditableState = 'rest' | 'interest' | 'edit' | 'saving';

/**
 * Props passed to the edit mode render function
 */
export interface RenderEditModeProps<T> {
  /** Current value to edit */
  value: T;
  /** Call to save the new value */
  onSave: (newValue: T) => void;
  /** Call to cancel editing (revert to rest) */
  onCancel: () => void;
  /** Ref to attach to the focusable input element */
  inputRef: RefObject<HTMLElement>;
  /** Current validation/save error message, if any */
  error: string | null;
  /** Clear the current error */
  clearError: () => void;
}

/**
 * Base props shared by all editable components
 */
export interface BaseEditableProps<T> {
  // === Core Data ===
  /** Field label text */
  label: string;
  /** Current field value */
  value: T;

  // === Display ===
  /** How to render value in rest/interest states. Defaults to String(value) */
  displayValue?: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** 
   * Function to format a value for display (used during saving state).
   * If not provided, falls back to displayValue or String(value).
   */
  formatValue?: (value: T) => ReactNode;

  // === State Control ===
  /** If true, locks component in rest state (not interactive) */
  readonly?: boolean;

  // === Controlled Mode ===
  /** Force the component into edit mode (controlled) */
  isEditing?: boolean;
  /** Called when edit state changes (controlled) */
  onEditingChange?: (editing: boolean) => void;

  // === Edit Mode ===
  /** Render function for the edit mode UI */
  renderEditMode: (props: RenderEditModeProps<T>) => ReactNode;

  // === Callbacks ===
  /** Called when user saves. Must return Promise for async save handling */
  onSave: (newValue: T) => Promise<void>;

  // === Validation ===
  /** Zod schema or function for validating before save */
  validate?: ZodSchema<T> | ((value: T) => string | null);

  // === Behavior ===
  /** 
   * If true, don't exit edit mode on blur (useful for portaled dropdowns).
   * The edit mode component is responsible for calling onCancel when appropriate.
   */
  exitOnBlur?: boolean;
}

/**
 * Internal state for BaseEditable
 */
export interface BaseEditableInternalState<T> {
  /** Current UI state */
  state: EditableState;
  /** Value being saved (for optimistic display during save) */
  pendingValue: T | null;
  /** Current error message (validation or save error) */
  error: string | null;
}

/**
 * Option type for select components
 */
export interface EditableSelectOption {
  value: string;
  label: string;
  /** Optional flag to disable this option */
  disabled?: boolean;
}

// Re-export base components from Radix UI (unchanged)
import * as SelectPrimitive from '@radix-ui/react-select';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

// Re-export enhanced components
export { SelectTrigger, selectTriggerVariants } from './SelectTrigger';
export { SelectItem, selectItemVariants } from './SelectItem';
export { SelectLabel, selectLabelVariants } from './SelectLabel';

// Re-export from ui/select for Content, Separator, and Scroll buttons
export {
  SelectContent,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from '@/components/ui/select';

// Export types
export type {
  SelectTriggerProps,
  SelectItemProps,
  SelectLabelProps,
} from './types';

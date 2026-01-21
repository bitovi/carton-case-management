import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { type VariantProps } from 'class-variance-authority';

import { selectTriggerVariants } from './SelectTrigger';
import { selectItemVariants } from './SelectItem';
import { selectLabelVariants } from './SelectLabel';

/**
 * Props for the enhanced SelectTrigger component
 */
export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

/**
 * Props for the enhanced SelectItem component
 */
export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    VariantProps<typeof selectItemVariants> {
  /**
   * Secondary line of text displayed below the main label
   */
  description?: string;
}

/**
 * Props for the enhanced SelectLabel component
 */
export interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>,
    VariantProps<typeof selectLabelVariants> {}

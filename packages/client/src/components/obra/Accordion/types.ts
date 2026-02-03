import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { AccordionTriggerProps } from './AccordionTrigger';
import type { AccordionContentProps } from './AccordionContent';

export type AccordionItem = {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  triggerProps?: Omit<AccordionTriggerProps, 'children'>;
  contentProps?: Omit<AccordionContentProps, 'children'>;
};

type BaseAccordionProps = {
  items: AccordionItem[];
  className?: string;
};

type AccordionSingleProps = BaseAccordionProps &
  Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
    'asChild' | 'type'
  > & {
    type: 'single';
    collapsible?: boolean;
  };

type AccordionMultipleProps = BaseAccordionProps &
  Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
    'asChild' | 'type'
  > & {
    type: 'multiple';
  };

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

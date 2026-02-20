import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from './AccordionContent';
import type { AccordionProps } from './types';

export type { AccordionProps, AccordionItem } from './types';

export const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>((props, ref) => {
  const { items, className, ...restProps } = props;

  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(className)}
      {...(restProps as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.value} value={item.value}>
          <AccordionTrigger {...item.triggerProps}>{item.trigger}</AccordionTrigger>
          <AccordionContent {...item.contentProps}>{item.content}</AccordionContent>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
});

Accordion.displayName = 'Accordion';

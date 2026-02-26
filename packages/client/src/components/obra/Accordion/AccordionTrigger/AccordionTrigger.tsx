import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { SvgIcon } from '@progress/kendo-react-common';
import { caretAltDownIcon } from '@progress/kendo-svg-icons';
import { cn } from '@/lib/utils';
import type { AccordionTriggerProps } from './types';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center gap-2 py-[15.5px] rounded-lg font-semibold text-sm leading-[21px] tracking-[0.07px] text-foreground transition-all',
        'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring',
        '[&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      <SvgIcon
        icon={caretAltDownIcon}
        size="medium"
        className="shrink-0 transition-transform duration-200"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

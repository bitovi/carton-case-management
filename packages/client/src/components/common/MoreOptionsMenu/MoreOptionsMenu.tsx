import * as React from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { moreVerticalIcon } from '@progress/kendo-svg-icons';
import { Button } from '@/components/obra/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/obra/Popover';
import { cn } from '@/lib/utils';
import type { MoreOptionsMenuProps, MenuItemProps } from './types';

export function MoreOptionsMenu({
  trigger,
  children,
  side = 'bottom',
  align = 'end',
  sideOffset = 4,
  'aria-label': ariaLabel = 'More options',
  open,
  onOpenChange,
}: MoreOptionsMenuProps) {
  const defaultTrigger = (
    <Button variant="ghost" size="small" roundness="round" aria-label={ariaLabel}>
      <SvgIcon icon={moreVerticalIcon} size="small" />
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        content="Menu"
        className="w-auto min-w-[200px]"
      >
        <div className="flex flex-col gap-1">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

export function MenuItem({ children, onClick, disabled = false, icon, className }: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      size="small"
      onClick={onClick}
      disabled={disabled}
      leftIcon={icon}
      className={cn('w-full justify-start gap-4 h-auto px-3 py-2 text-sm font-normal', className)}
    >
      {children}
    </Button>
  );
}

import * as React from 'react';
import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AlertDialogProps } from './types';

export function AlertDialog({
  type = 'mobile',
  title,
  description,
  actionButton,
  cancelButton,
  actionLabel,
  cancelLabel,
  onAction,
  onCancel,
  open,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const isMobile = type === 'mobile';

  const headerClassName = cn(
    'space-y-2',
    isMobile ? 'text-center sm:text-center' : 'text-left'
  );


  const footerClassName = cn(
    'flex',
    isMobile 
      ? 'flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0' 
      : 'flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'
  );

  const primaryButton = actionButton || (
    <AlertDialogAction asChild>
      <Button variant="default" onClick={onAction} className={isMobile ? 'w-full' : ''}>
        {actionLabel || 'Continue'}
      </Button>
    </AlertDialogAction>
  );

  const secondaryButton = cancelButton || (
    <AlertDialogCancel asChild>
      <Button variant="outline" onClick={onCancel} className={isMobile ? 'w-full' : ''}>
        {cancelLabel || 'Cancel'}
      </Button>
    </AlertDialogCancel>
  );

  const buttons = isMobile ? (
    <>
      {primaryButton}
      {secondaryButton}
    </>
  ) : (
    <>
      {secondaryButton}
      {primaryButton}
    </>
  );

  return (
    <AlertDialogPrimitive open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent className={cn(isMobile && 'max-w-xs')}>
        <AlertDialogHeader className={headerClassName}>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={footerClassName}>{buttons}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}


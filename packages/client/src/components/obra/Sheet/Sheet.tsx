import * as React from 'react';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { SheetProps } from './types';

const sheetVariants = cva(
  // Base styles for the sheet panel
  [
    'fixed z-50 flex flex-col',
    'bg-background',
    'shadow-lg',
    'transition-transform duration-300 ease-in-out',
  ],
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b rounded-b-xl',
        bottom: 'inset-x-0 bottom-0 border-t rounded-t-xl',
        left: 'inset-y-0 left-0 h-full w-[342px] border-r',
        right: 'inset-y-0 right-0 h-full w-[342px] border-l',
      },
      open: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Slide animations based on side and open state
      { side: 'top', open: true, className: 'translate-y-0' },
      { side: 'top', open: false, className: '-translate-y-full' },
      { side: 'bottom', open: true, className: 'translate-y-0' },
      { side: 'bottom', open: false, className: 'translate-y-full' },
      { side: 'left', open: true, className: 'translate-x-0' },
      { side: 'left', open: false, className: '-translate-x-full' },
      { side: 'right', open: true, className: 'translate-x-0' },
      { side: 'right', open: false, className: 'translate-x-full' },
    ],
    defaultVariants: {
      side: 'right',
      open: false,
    },
  }
);

/**
 * Sheet component - A sliding panel that displays supplementary content.
 *
 * @figma Obra/Sheet - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=301-243233
 *
 * @example
 * // Scrollable variant (with close button and footer)
 * <Sheet
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   scrollable={true}
 *   cancelLabel="Cancel"
 *   actionLabel="Save"
 *   onAction={handleSave}
 * >
 *   <form>...</form>
 * </Sheet>
 *
 * @example
 * // Non-scrollable variant (just content slot)
 * <Sheet open={isOpen} onOpenChange={setIsOpen} scrollable={false}>
 *   <nav>...</nav>
 * </Sheet>
 */
export function Sheet({
  open,
  onOpenChange,
  children,
  scrollable = true,
  side = 'right',
  cancelLabel = 'Cancel',
  actionLabel = 'Submit',
  onCancel,
  onAction,
  className,
}: SheetProps) {
  // Handle body scroll lock
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleAction = () => {
    onAction?.();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div
        className={cn(sheetVariants({ side, open }), className)}
        role="dialog"
        aria-modal="true"
      >
        {scrollable ? (
          // Scrollable=True variant: Close button + content + footer
          <>
            {/* Header with close button */}
            <div className="flex items-center justify-end p-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-auto rounded-lg">
              {children}
            </div>

            {/* Footer with action buttons */}
            <div className="flex items-center justify-end gap-2 p-4 w-80 self-end">
              <Button
                variant="outline"
                size="default"
                onClick={handleCancel}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="default"
                size="default"
                onClick={handleAction}
              >
                {actionLabel}
              </Button>
            </div>
          </>
        ) : (
          // Scrollable=False variant: Just content slot
          <div className="flex-1 flex items-center justify-center rounded-lg">
            {children}
          </div>
        )}
      </div>
    </>
  );
}

Sheet.displayName = 'Sheet';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
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

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[10px] shadow-[0px_25px_50px_12px_rgba(0,0,0,0.25)] z-50 lg:hidden max-h-[80vh] flex flex-col animate-slide-up">
        <div className="flex justify-end p-4">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="icon"
            className="h-auto w-auto p-1"
            aria-label="Close"
          >
            <X size={16} className="text-gray-600" />
          </Button>
        </div>
        <div className="overflow-y-auto flex-1 px-2 pb-4">{children}</div>
      </div>
    </>
  );
}

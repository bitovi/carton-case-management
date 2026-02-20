import { Dialog, DialogFooter, DialogHeader, Button } from '@/components/obra';
import { FiltersList } from '../FiltersList';
import { cn } from '@/lib/utils';
import type { FiltersDialogProps } from './types';

export function FiltersDialog({
  open,
  onOpenChange,
  filters,
  title = 'Filters',
  onApply,
  onClear,
  className,
}: FiltersDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      type="Desktop Scrollable"
      header={
        <DialogHeader
          type="Close Only"
          onClose={() => onOpenChange(false)}
        />
      }
      footer={
        <DialogFooter type="2 Buttons Right">
          <Button variant="outline" onClick={onClear}>
            Clear
          </Button>
          <Button onClick={onApply}>
            Apply
          </Button>
        </DialogFooter>
      }
      className={cn('w-[400px]', className)}
    >
      <FiltersList filters={filters} title={title} className="w-full" />
    </Dialog>
  );
}

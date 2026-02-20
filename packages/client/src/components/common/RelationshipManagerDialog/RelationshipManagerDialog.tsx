import { cn } from '@/lib/utils';
import { Dialog, DialogFooter, DialogHeader } from '@/components/obra/Dialog';
import { Button } from '@/components/obra';
import type { RelationshipManagerDialogProps } from './types';
import type { RelationshipManagerListItem } from './components/RelationshipManagerList/types';
import { RelationshipManagerList } from './components/RelationshipManagerList';

export function RelationshipManagerDialog({
  open,
  onOpenChange,
  title,
  items,
  selectedItems,
  onSelectionChange,
  onAdd,
  className,
}: RelationshipManagerDialogProps) {
  const listItems: RelationshipManagerListItem[] = items.map((item) => ({
    ...item,
    selected: selectedItems.includes(item.id),
  }));

  const handleToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      type="Desktop Scrollable"
      header={
        <DialogHeader
          type="Close Only"
          onClose={() => {
            onOpenChange(false);
          }}
        />
      }
      footer={
        <DialogFooter>
          <Button
            onClick={() => onAdd(selectedItems)}
            disabled={selectedItems.length === 0}
            className="bg-gray-950 text-white hover:bg-gray-800"
          >
            Add
          </Button>
        </DialogFooter>
      }
      className={cn('w-[400px] h-auto max-h-[90vh]', className)}
    >
      <RelationshipManagerList title={title} items={listItems} onItemToggle={handleToggle} className="w-full" />
    </Dialog>
  );
}

import { AlertDialog } from '@/components/obra';
import { Button } from '@/components/obra/Button';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmClassName?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmClassName = '',
  isLoading = false,
  loadingText,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      type="desktop"
      actionButton={
        <Button
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
          }}
          disabled={isLoading}
          className={confirmClassName}
          variant="primary"
        >
          {isLoading ? loadingText || confirmText : confirmText}
        </Button>
      }
      cancelButton={
        <Button variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>
          {cancelText}
        </Button>
      }
    />
  );
}

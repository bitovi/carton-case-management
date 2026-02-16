import { useToast } from './useToast';
import { Toast } from './Toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          icon={toast.icon}
          duration={toast.duration}
          open={toast.open}
          onOpenChange={(open) => {
            if (!open) {
              dismiss(toast.id);
            }
          }}
        />
      ))}
    </>
  );
}

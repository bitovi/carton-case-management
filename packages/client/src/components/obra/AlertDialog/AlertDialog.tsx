import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type {
  AlertDialogProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContextValue,
} from './types';

// Context to share variant across components
const AlertDialogContext = React.createContext<AlertDialogContextValue>({
  variant: 'desktop',
});

const useAlertDialogContext = () => React.useContext(AlertDialogContext);

// Root component
const AlertDialog: React.FC<AlertDialogProps> = AlertDialogPrimitive.Root;
AlertDialog.displayName = 'AlertDialog';

// Trigger component
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

// Portal component
const AlertDialogPortal = AlertDialogPrimitive.Portal;

// Overlay with Figma-matched styling
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  AlertDialogOverlayProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

// Content with variant support
const contentVariants = cva(
  [
    'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
    'flex flex-col gap-4',
    'bg-background border border-border rounded-xl p-8',
    'shadow-lg',
    'duration-200',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
  ],
  {
    variants: {
      variant: {
        mobile: 'w-[320px] max-w-[calc(100%-2rem)]',
        desktop: 'w-[480px] max-w-[calc(100%-2rem)]',
      },
    },
    defaultVariants: {
      variant: 'desktop',
    },
  }
);

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, variant = 'desktop', children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogContext.Provider value={{ variant }}>
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(contentVariants({ variant }), className)}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogContext.Provider>
  </AlertDialogPortal>
));
AlertDialogContent.displayName = 'AlertDialogContent';

// Header - variant-aware text alignment
const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
  className,
  ...props
}) => {
  const { variant } = useAlertDialogContext();

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        variant === 'mobile' ? 'text-center' : 'text-left',
        className
      )}
      {...props}
    />
  );
};
AlertDialogHeader.displayName = 'AlertDialogHeader';

// Footer - variant-aware button layout
const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
  className,
  ...props
}) => {
  const { variant } = useAlertDialogContext();

  return (
    <div
      className={cn(
        'flex gap-2',
        variant === 'mobile'
          ? 'flex-col w-full'
          : 'flex-row justify-end',
        className
      )}
      {...props}
    />
  );
};
AlertDialogFooter.displayName = 'AlertDialogFooter';

// Title with Figma typography
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-6 tracking-normal text-foreground',
      className
    )}
    {...props}
  />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

// Description with Figma typography
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm leading-5 text-muted-foreground', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

// Action button variants
const actionVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'min-h-[36px] px-4 py-2 rounded-lg',
    'text-sm font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-primary text-destructive-foreground hover:bg-primary/90',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      fullWidth: false,
    },
  }
);

// Action button
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, variant = 'default', ...props }, ref) => {
  const { variant: layoutVariant } = useAlertDialogContext();

  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(
        actionVariants({
          variant,
          fullWidth: layoutVariant === 'mobile',
        }),
        className
      )}
      {...props}
    />
  );
});
AlertDialogAction.displayName = 'AlertDialogAction';

// Cancel button
const cancelVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'min-h-[36px] px-4 py-2 rounded-lg',
    'text-sm font-medium',
    'bg-white/10 border border-[#d4d4d4] shadow-sm',
    'text-foreground',
    'transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => {
  const { variant } = useAlertDialogContext();

  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(
        cancelVariants({ fullWidth: variant === 'mobile' }),
        className
      )}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  useAlertDialogContext,
};

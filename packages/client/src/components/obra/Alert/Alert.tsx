import { cn } from '@/lib/utils';
import type { AlertProps } from './types';

export function Alert({ 
  type = 'Neutral',
  children,
  description,
  showLine2,
  icon,
  showIcon,
  flipIcon = false,
  action,
  showButton,
  className,
}: AlertProps) {
  const typeStyles = {
    Neutral: {
      container: 'bg-card border-border',
      text: 'text-foreground',
      description: 'text-muted-foreground',
      icon: '',
    },
    Error: {
      container: 'bg-card border-border',
      text: 'text-destructive-foreground',
      description: 'text-destructive-foreground',
      icon: 'text-destructive-foreground',
    },
  };

  const styles = typeStyles[type];
  
  const shouldShowIcon = showIcon ?? (icon !== undefined);
  const shouldShowButton = showButton ?? (action !== undefined);
  const shouldShowLine2 = showLine2 ?? (description !== undefined);
  const iconPosition = flipIcon ? 'end' : 'start';

  return (
    <div 
      className={cn(
        'flex items-center gap-4 rounded-lg border p-4 shadow-sm',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex flex-1 items-start gap-3">
        {shouldShowIcon && iconPosition === 'start' && icon && (
          <div className={cn('flex shrink-0 items-center pt-[3px]', styles.icon)}>
            {icon}
          </div>
        )}
        
        <div className="flex flex-1 flex-col gap-0.5">
          <p className={cn('text-sm font-semibold leading-[21px] tracking-[0.07px]', styles.text)}>
            {children}
          </p>
          {shouldShowLine2 && description && (
            <p className={cn('text-sm font-normal leading-[21px] tracking-[0.07px]', styles.description)}>
              {description}
            </p>
          )}
        </div>
        
        {shouldShowIcon && iconPosition === 'end' && icon && (
          <div className={cn('flex shrink-0 items-center pt-[3px]', styles.icon)}>
            {icon}
          </div>
        )}
      </div>
      
      {shouldShowButton && action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

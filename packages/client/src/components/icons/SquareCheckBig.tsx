import { forwardRef } from 'react';
import { SquareCheckBig as LucideSquareCheckBig } from 'lucide-react';

interface SquareCheckBigProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number | string;
  state?: 'default' | 'disabled';
  color?: string;
  strokeWidth?: string | number;
  absoluteStrokeWidth?: boolean;
}

const sizeMap: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
};

export const SquareCheckBig = forwardRef<SVGSVGElement, SquareCheckBigProps>(
  (
    {
      size = 'md',
      state = 'default',
      color = '#000000',
      strokeWidth = 2,
      absoluteStrokeWidth,
      className,
      ...props
    },
    ref
  ) => {
    const numericSize =
      typeof size === 'string' && size in sizeMap
        ? sizeMap[size as keyof typeof sizeMap]
        : typeof size === 'string'
          ? parseInt(size, 10)
          : size;

    const opacity = state === 'disabled' ? 0.5 : 1;

    return (
      <LucideSquareCheckBig
        ref={ref}
        size={numericSize}
        color={color}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth={absoluteStrokeWidth}
        className={className}
        style={{ opacity, ...props.style }}
        {...props}
      />
    );
  }
);

SquareCheckBig.displayName = 'SquareCheckBig';

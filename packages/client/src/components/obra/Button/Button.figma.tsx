import figma from '@figma/code-connect';
import { Button } from './Button';

/**
 * Code Connect mapping for the Obra Button component.
 *
 * Maps Figma variants to React props for the Button component.
 *
 * Figma URL: https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=273-30945&m=dev
 */

// Primary Button - Default State
figma.connect(Button, 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=9:1068', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'default',
      Secondary: 'secondary',
      Outline: 'outline',
      Ghost: 'ghost',
      Destructive: 'destructive',
    }),
    size: figma.enum('Size', {
      Default: 'default',
      Large: 'lg',
      Small: 'sm',
      Mini: 'xs',
    }),
    roundness: figma.enum('Roundness', {
      Default: 'default',
      Round: 'round',
    }),
    disabled: figma.enum('State', {
      Disabled: true,
    }),
    leftIcon: figma.boolean('showLeftIcon', {
      true: figma.instance('Left icon'),
      false: undefined,
    }),
    rightIcon: figma.boolean('showRightIcon', {
      true: figma.instance('Right icon'),
      false: undefined,
    }),
    children: figma.textContent('Label'),
  },
  example: ({ variant, size, roundness, disabled, leftIcon, rightIcon, children }) => (
    <Button
      variant={variant}
      size={size}
      roundness={roundness}
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    >
      {children}
    </Button>
  ),
});

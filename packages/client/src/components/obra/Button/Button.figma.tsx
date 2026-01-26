import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(
  Button,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=9:1071',
  {
    props: {
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
        Outline: 'outline',
        Ghost: 'ghost',
        'Ghost Muted': 'ghost-muted',
        Destructive: 'destructive',
      }),

      size: figma.enum('Size', {
        Large: 'large',
        Regular: 'regular',
        Small: 'small',
        Mini: 'mini',
      }),

      roundness: figma.enum('Roundness', {
        Default: 'default',
        Round: 'round',
      }),

      children: figma.textContent('*'),

      leftIcon: figma.instance('Left icon wrapper'),
      rightIcon: figma.instance('Right icon wrapper'),
    },

    example: ({ variant, size, roundness, children, leftIcon, rightIcon }) => (
      <Button
        variant={variant}
        size={size}
        roundness={roundness}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      >
        {children}
      </Button>
    ),
  }
);


import figma from '@figma/code-connect';
import { Input } from './Input';

/**
 * Code Connect mapping for Input component
 * Maps Figma variants to React props for the Input component
 *
 * Figma Source: https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Community-?node-id=279-98539
 */
figma.connect(
  Input,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Community-?node-id=279-98539',
  {
    props: {
      // Figma Variant: Size → size prop
      size: figma.enum('Size', {
        Mini: 'mini',
        Small: 'sm',
        Regular: 'md',
        Large: 'lg',
      }),

      // Figma Variant: Roundness → roundness prop
      roundness: figma.enum('Roundness', {
        Default: 'default',
        Round: 'round',
      }),

      // Figma State: Error states → error prop
      error: figma.enum('State', {
        Error: true,
        'Error Focus': true,
        Empty: false,
        Placeholder: false,
        Value: false,
        Focus: false,
        Disabled: false,
      }),

      // Figma State: Disabled → disabled prop
      disabled: figma.enum('State', {
        Disabled: true,
        Empty: false,
        Placeholder: false,
        Value: false,
        Focus: false,
        Error: false,
        'Error Focus': false,
      }),

      // Figma Boolean: Decoration left → leftDecorator
      leftDecorator: figma.boolean('Decoration left', {
        true: figma.instance('Decoration left'),
        false: undefined,
      }),

      // Figma Boolean: Decoration right → rightDecorator
      rightDecorator: figma.boolean('Decoration right', {
        true: figma.instance('Decoration right'),
        false: undefined,
      }),
    },

    example: ({ size, roundness, error, disabled, leftDecorator, rightDecorator }) => (
      <Input
        size={size}
        roundness={roundness}
        error={error}
        disabled={disabled}
        leftDecorator={leftDecorator}
        rightDecorator={rightDecorator}
        placeholder="Enter value..."
      />
    ),
  }
);

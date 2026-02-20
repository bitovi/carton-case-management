import figma from '@figma/code-connect';
import { Badge } from './Badge';

figma.connect(
  Badge,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6979',
  {
    props: {
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
        Outline: 'outline',
        Ghost: 'ghost',
        Destructive: 'destructive',
      }),
      roundness: figma.enum('Roundness', {
        Default: 'default',
        Round: 'round',
      }),
      children: figma.textContent('Label'),
      iconLeft: figma.boolean('Show icon left', {
        true: figma.instance('⮑ Icon left'),
        false: undefined,
      }),
      iconRight: figma.boolean('Show icon right', {
        true: figma.instance('⮑ Icon right'),
        false: undefined,
      }),
    },
    example: ({ variant, roundness, children, iconLeft, iconRight }) => (
      <Badge
        variant={variant}
        roundness={roundness}
        iconLeft={iconLeft}
        iconRight={iconRight}
      >
        {children}
      </Badge>
    ),
  }
);

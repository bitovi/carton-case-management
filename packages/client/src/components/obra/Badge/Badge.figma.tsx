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

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Badge,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=19-6979',
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

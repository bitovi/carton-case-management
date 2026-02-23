import figma from '@figma/code-connect';
import { Label } from './Label';

figma.connect(
  Label,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=103-9453&m=dev',
  {
  props: {
    layout: figma.enum('Layout', {
      Inline: 'inline',
      Block: 'block',
    }),
    children: figma.textContent('Label'),
  },
  example: ({ layout, children }) => {
    return (
      <Label layout={layout}>
        {children}
      </Label>
    );
  },
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Label,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=103-9453',
  {
  props: {
    layout: figma.enum('Layout', {
      Inline: 'inline',
      Block: 'block',
    }),
    children: figma.textContent('Label'),
  },
  example: ({ layout, children }) => {
    return (
      <Label layout={layout}>
        {children}
      </Label>
    );
  },
}
);

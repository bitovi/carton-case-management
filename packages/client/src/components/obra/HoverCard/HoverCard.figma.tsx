import figma from '@figma/code-connect';
import { HoverCard } from './HoverCard';

figma.connect(
  HoverCard,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246487',
  {
  props: {
    children: figma.children('.Slot Inner'),
  },
  example: ({ children }) => (
    <HoverCard trigger={<button>Hover trigger</button>}>
      {children}
    </HoverCard>
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  HoverCard,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=303-246487',
  {
  props: {
    children: figma.children('.Slot Inner'),
  },
  example: ({ children }) => (
    <HoverCard trigger={<button>Hover trigger</button>}>
      {children}
    </HoverCard>
  ),
}
);

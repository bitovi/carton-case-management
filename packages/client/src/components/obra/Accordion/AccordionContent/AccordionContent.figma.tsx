import figma from '@figma/code-connect';
import { AccordionContent } from './AccordionContent';

figma.connect(
  AccordionContent,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=66-5041',
  {
  props: {
    children: figma.children('*'),
  },
  example: ({ children }) => <AccordionContent>{children}</AccordionContent>,
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  AccordionContent,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=66-5041',
  {
  props: {
    children: figma.children('*'),
  },
  example: ({ children }) => <AccordionContent>{children}</AccordionContent>,
}
);

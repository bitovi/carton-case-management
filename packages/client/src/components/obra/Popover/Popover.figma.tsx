import figma from '@figma/code-connect';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '../Button';

figma.connect(
  Popover,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=2335-26&m=dev',
  {
  props: {
    children: figma.children('*'),
  },

  example: ({ children }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {children}
      </PopoverContent>
    </Popover>
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Popover,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=2335-26',
  {
  props: {
    children: figma.children('*'),
  },

  example: ({ children }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {children}
      </PopoverContent>
    </Popover>
  ),
}
);
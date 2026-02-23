import figma from '@figma/code-connect';
import { Calendar } from './Calendar';

figma.connect(
  Calendar,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-119954&m=dev',
  {
  example: () => (
    <Calendar
      mode="single"
      selected={new Date()}
      onSelect={(date) => console.log(date)}
    />
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Calendar,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=288-119954',
  {
  example: () => (
    <Calendar
      mode="single"
      selected={new Date()}
      onSelect={(date) => console.log(date)}
    />
  ),
}
);

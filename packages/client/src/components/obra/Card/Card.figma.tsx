import figma from '@figma/code-connect';
import { Card } from './Card';

figma.connect(
  Card,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=179-29234',
  {
  example: () => (
    <Card 
      header={<div>Header content</div>}
      main={<div>Main content</div>}
      footer={<div>Footer content</div>}
    />
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Card,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=179-29234',
  {
  example: () => (
    <Card 
      header={<div>Header content</div>}
      main={<div>Main content</div>}
      footer={<div>Footer content</div>}
    />
  ),
}
);

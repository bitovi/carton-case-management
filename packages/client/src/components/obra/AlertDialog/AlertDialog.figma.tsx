import figma from '@figma/code-connect';
import { AlertDialog } from './AlertDialog';
import { Button } from '../Button';

figma.connect(
  AlertDialog,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=139-11941',
  {
  props: {
    type: figma.enum('Type', {
      Desktop: 'desktop',
      Mobile: 'mobile',
    }),
    title: figma.textContent('Title'),
    description: figma.textContent('Text'),
  },

  example: ({ type, title, description }) => (
    <AlertDialog 
      type={type}
      title={title} 
      description={description}
      actionButton={<Button variant="primary">Label</Button>}
      cancelButton={<Button variant="outline">Label</Button>}
    />
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  AlertDialog,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=139-11941',
  {
  props: {
    type: figma.enum('Type', {
      Desktop: 'desktop',
      Mobile: 'mobile',
    }),
    title: figma.textContent('Title'),
    description: figma.textContent('Text'),
  },

  example: ({ type, title, description }) => (
    <AlertDialog 
      type={type}
      title={title} 
      description={description}
      actionButton={<Button variant="primary">Label</Button>}
      cancelButton={<Button variant="outline">Label</Button>}
    />
  ),
}
);


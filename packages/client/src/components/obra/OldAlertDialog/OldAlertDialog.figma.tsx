import figma from '@figma/code-connect';
import { OldAlertDialog } from './OldAlertDialog';
import { Button } from '../Button';

figma.connect(
  OldAlertDialog,
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
      <OldAlertDialog 
        type={type}
        title={title} 
        description={description}
        actionButton={<Button variant="primary">Label</Button>}
        cancelButton={<Button variant="outline">Label</Button>}
      />
    ),
  }
);


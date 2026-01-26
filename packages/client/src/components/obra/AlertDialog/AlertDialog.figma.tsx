import figma from '@figma/code-connect';
import { AlertDialog } from './AlertDialog';
import { Button } from '@/components/obra/Button';

figma.connect(
  AlertDialog,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=139-11941',
  {
    props: {
      type: figma.enum('Type', {
        Desktop: 'desktop',
        Mobile: 'mobile',
      }),
    },

    example: ({ type }) => (
      <AlertDialog 
        type={type}
        title="Title" 
        description="Text"
        actionButton={<Button variant="primary">Label</Button>}
        cancelButton={<Button variant="outline">Label</Button>}
      />
    ),
  }
);


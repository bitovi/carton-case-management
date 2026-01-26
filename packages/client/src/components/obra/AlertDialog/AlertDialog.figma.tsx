import figma from '@figma/code-connect';
import { AlertDialog } from './AlertDialog';

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
      />
    ),
  }
);


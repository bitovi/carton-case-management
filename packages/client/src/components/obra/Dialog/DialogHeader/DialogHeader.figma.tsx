import figma from '@figma/code-connect';
import { DialogHeader } from './DialogHeader';

figma.connect(
  DialogHeader,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22344',
  {
    props: {
      type: figma.enum('Type', {
        'Header': 'Header',
        'Close Only': 'Close Only',
        'Icon Button Close': 'Icon Button Close',
      }),
    },
    example: (props) => <DialogHeader {...props} />,
  }
);

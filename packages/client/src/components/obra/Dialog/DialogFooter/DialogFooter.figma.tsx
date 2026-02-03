import figma from '@figma/code-connect';
import { DialogFooter } from './DialogFooter';

figma.connect(
  DialogFooter,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-21284',
  {
    props: {
      type: figma.enum('Type', {
        '2 Buttons Right': '2 Buttons Right',
        '2 Full-width Buttons': '2 Full-width Buttons',
        'Single Full-width Button': 'Single Full-width Button',
      }),
      children: figma.children('AL'),
    },
    example: (props) => <DialogFooter {...props} />,
  }
);

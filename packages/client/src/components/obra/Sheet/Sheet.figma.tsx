import figma from '@figma/code-connect';
import { Sheet } from './Sheet';

figma.connect(
  Sheet,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=301-243831',
  {
    props: {
      scrollable: figma.enum('Scrollable', {
        True: true,
        False: false,
      }),
    },
    example: ({ scrollable }) => (
      <Sheet
        open={true}
        scrollable={scrollable}
        header="DialogHeader component"
        footer="DialogFooter component"
      >
        Content goes here
      </Sheet>
    ),
  }
);

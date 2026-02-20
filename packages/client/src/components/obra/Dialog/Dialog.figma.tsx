import figma from '@figma/code-connect';
import { Dialog } from './Dialog';
import { DialogHeader } from './DialogHeader/DialogHeader';
import { DialogFooter } from './DialogFooter/DialogFooter';
import { Button } from '../Button';

figma.connect(
  Dialog,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=151-12298',
  {
    props: {
      type: figma.enum('Type', {
        'Desktop': 'Desktop',
        'Desktop Scrollable': 'Desktop Scrollable',
        'Mobile': 'Mobile',
        'Mobile Full Screen Scrollable': 'Mobile Full Screen Scrollable',
      }),
    },
    example: (props) => (
      <Dialog 
        open={true}
        onOpenChange={() => {}}
        type={props.type}
        header={<DialogHeader type="Header" title="Title" onClose={() => {}} />}
        footer={
          <DialogFooter type="2 Buttons Right">
            <Button variant="outline">Secondary</Button>
            <Button variant="primary">Primary</Button>
          </DialogFooter>
        }
      >
        <div>Content</div>
      </Dialog>
    ),
  }
);

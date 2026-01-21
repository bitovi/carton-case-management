import figma from '@figma/code-connect';
import { Sheet } from './Sheet';

/**
 * Code Connect mapping for Sheet component
 * @figma https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=151-12343
 */
figma.connect(Sheet, 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=151-12343', {
  props: {
    scrollable: figma.boolean('Scrollable', {
      true: true,
      false: false,
    }),
    children: figma.children('*'),
  },
  example: ({ scrollable, children }) => (
    <Sheet
      open={true}
      onOpenChange={() => {}}
      scrollable={scrollable}
      cancelLabel="Cancel"
      actionLabel="Submit"
    >
      {children}
    </Sheet>
  ),
});

// Scrollable=True variant
figma.connect(Sheet, 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=151-12343', {
  variant: { Scrollable: 'True' },
  example: () => (
    <Sheet
      open={true}
      onOpenChange={() => {}}
      scrollable={true}
      cancelLabel="Cancel"
      actionLabel="Submit"
    >
      <div>Content slot</div>
    </Sheet>
  ),
});

// Scrollable=False variant
figma.connect(Sheet, 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=151-12330', {
  variant: { Scrollable: 'False' },
  example: () => (
    <Sheet
      open={true}
      onOpenChange={() => {}}
      scrollable={false}
    >
      <div>Content slot</div>
    </Sheet>
  ),
});

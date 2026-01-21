import figma from '@figma/code-connect';
import { Label } from './Label';

/**
 * Label - Block layout variant
 * Default block-level label display
 */
figma.connect(
  Label,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=16:1663',
  {
    variant: { Layout: 'Block' },
    props: {
      children: figma.textContent('*'),
    },
    example: ({ children }) => <Label>{children}</Label>,
  }
);

/**
 * Label - Inline layout variant
 * Inline label for checkboxes and radio buttons
 */
figma.connect(
  Label,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=103:9452',
  {
    variant: { Layout: 'Inline' },
    props: {
      children: figma.textContent('*'),
    },
    example: ({ children }) => <Label layout="inline">{children}</Label>,
  }
);

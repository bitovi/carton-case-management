import figma from '@figma/code-connect';
import { AccordionContent } from './AccordionContent';

figma.connect(
  AccordionContent,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=66-5041',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({ children }) => <AccordionContent>{children}</AccordionContent>,
  }
);

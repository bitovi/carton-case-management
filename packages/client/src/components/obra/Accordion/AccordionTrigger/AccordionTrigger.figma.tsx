import figma from '@figma/code-connect';
import { AccordionTrigger } from './AccordionTrigger';

figma.connect(
  AccordionTrigger,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=66-5034',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({ children }) => <AccordionTrigger>{children}</AccordionTrigger>,
  }
);

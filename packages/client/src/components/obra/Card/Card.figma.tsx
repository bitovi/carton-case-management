import figma from '@figma/code-connect';
import { Card } from './Card';

figma.connect(
  Card,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=179-29234',
  {
    example: () => (
      <Card 
        header={<div>Header content</div>}
        main={<div>Main content</div>}
        footer={<div>Footer content</div>}
      />
    ),
  }
);

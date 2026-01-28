import figma from '@figma/code-connect';
import { Skeleton } from './Skeleton';

figma.connect(
  Skeleton,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246698',
  {
    example: () => (
      <Skeleton 
        variant="object" 
      />
    ),
  }
);

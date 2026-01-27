import figma from '@figma/code-connect';
import { Calendar } from './Calendar';


figma.connect(
  Calendar,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-119954&m=dev',
  {
    example: () => (
      <Calendar
        mode="single"
        selected={new Date()}
        onSelect={(date) => console.log(date)}
      />
    ),
  }
);

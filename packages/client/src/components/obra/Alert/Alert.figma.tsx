import figma from '@figma/code-connect';
import { Alert } from './Alert';
import { Button } from '../Button';

figma.connect(Alert, 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=58-5416', {
  props: {
    type: figma.enum('Type', {
      Neutral: 'Neutral',
      Error: 'Error',
    }),
    children: figma.textContent('Line 1'),
    description: figma.boolean('Show Line 2', {
      true: figma.textContent('Line 2'),
      false: undefined,
    }),
    showLine2: figma.boolean('Show Line 2'),
    icon: figma.boolean('Show Icon', {
      true: figma.instance('Icon'),
      false: undefined,
    }),
    showIcon: figma.boolean('Show Icon'),
    flipIcon: figma.boolean('Flip Icon'),
    showButton: figma.boolean('Show Button'),
  },
  example: ({ type, children, description, showLine2, icon, showIcon, flipIcon, showButton }) => (
    <Alert
      type={type}
      description={description}
      showLine2={showLine2}
      icon={icon}
      showIcon={showIcon}
      flipIcon={flipIcon}
      action={showButton ? <Button variant="outline">Action</Button> : undefined}
    >
      {children}
    </Alert>
  ),
});

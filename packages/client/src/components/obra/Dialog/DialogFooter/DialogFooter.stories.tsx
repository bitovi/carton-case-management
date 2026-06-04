// type import removed:  Meta, StoryObj  from '@storybook/react';
import { DialogFooter } from './DialogFooter';
import { Button } from '../../Button';

const meta = {
  component: DialogFooter,
  title: 'Obra/DialogFooter',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=593-62172&m=dev',
    },
  },
};

export default meta;


export const TwoButtonsRight = {
  args: {
    type: '2 Buttons Right',
    children: (
      <>
        <Button variant="outline">Label</Button>
        <Button variant="primary">Label</Button>
      </>
    ),
  },
};

export const TwoFullWidthButtons = {
  args: {
    type: '2 Full-width Buttons',
    children: (
      <>
        <Button variant="outline" className="flex-1">Label</Button>
        <Button variant="primary" className="flex-1">Label</Button>
      </>
    ),
  },
};

export const SingleFullWidthButton = {
  args: {
    type: 'Single Full-width Button',
    children: <Button variant="primary" className="w-full">Label</Button>,
  },
};

export const DestructiveAction = {
  args: {
    type: '2 Buttons Right',
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </>
    ),
  },
};

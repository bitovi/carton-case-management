// type import removed:  Meta, StoryObj  from '@storybook/react';
import { fn } from '@storybook/test';
import { DialogHeader } from './DialogHeader';

const meta = {
  component: DialogHeader,
  title: 'Obra/DialogHeader',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22344&m=dev',
    },
  },
  args: {
    onClose: fn(),
  },
};

export default meta;


export const Header = {
  args: {
    type: 'Header',
    title: 'Dialog Title',
  },
};

export const CloseOnly = {
  args: {
    type: 'Close Only',
  },
};

export const IconButtonClose = {
  args: {
    type: 'Icon Button Close',
  },
};

export const LongTitle = {
  args: {
    type: 'Header',
    title: 'This is a longer title that demonstrates how the header handles extended text content',
  },
};

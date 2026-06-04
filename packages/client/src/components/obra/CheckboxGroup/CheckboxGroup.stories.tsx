// type import removed:  Meta, StoryObj  from '@storybook/react';
import { CheckboxGroup } from './CheckboxGroup';

const meta = {
  component: CheckboxGroup,
  title: 'Obra/CheckboxGroup',
  tags: ['autodocs'],
};

export default meta;


// Inline Layout
export const InlineUnchecked = {
  args: {
    layout: 'inline',
    checked: false,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=103-9438',
    },
  },
};

export const InlineChecked = {
  args: {
    layout: 'inline',
    checked: true,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=103-9432',
    },
  },
};

// Block Layout
export const BlockUnchecked = {
  args: {
    layout: 'block',
    checked: false,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=280-104486',
    },
  },
};

export const BlockChecked = {
  args: {
    layout: 'block',
    checked: true,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=280-104489',
    },
  },
};

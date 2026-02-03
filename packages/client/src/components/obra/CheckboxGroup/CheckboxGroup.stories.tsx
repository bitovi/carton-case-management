import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxGroup } from './CheckboxGroup';

const meta: Meta<typeof CheckboxGroup> = {
  component: CheckboxGroup,
  title: 'Obra/CheckboxGroup',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

// Inline Layout
export const InlineUnchecked: Story = {
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

export const InlineChecked: Story = {
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
export const BlockUnchecked: Story = {
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

export const BlockChecked: Story = {
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

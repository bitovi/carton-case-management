import type { Meta, StoryObj } from '@storybook/react';
import { RichCheckboxGroup } from './RichCheckboxGroup';

const meta: Meta<typeof RichCheckboxGroup> = {
  component: RichCheckboxGroup,
  title: 'Obra/RichCheckboxGroup',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RichCheckboxGroup>;

export const UncheckedNormal: Story = {
  args: {
    checked: false,
    flipped: false,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6352',
    },
  },
};

export const CheckedNormal: Story = {
  args: {
    checked: true,
    flipped: false,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6358',
    },
  },
};

export const UncheckedFlipped: Story = {
  args: {
    checked: false,
    flipped: true,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=761-108811',
    },
  },
};

export const CheckedFlipped: Story = {
  args: {
    checked: true,
    flipped: true,
    label: 'Label',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=761-108817',
    },
  },
};

export const UncheckedNormalWithSecondary: Story = {
  args: {
    checked: false,
    flipped: false,
    showLine2: true,
    label: 'Label',
    secondaryText: 'Secondary text',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=761-108895',
    },
  },
};

export const CheckedNormalWithSecondary: Story = {
  args: {
    checked: true,
    flipped: false,
    showLine2: true,
    label: 'Label',
    secondaryText: 'Secondary text',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=761-108903',
    },
  },
};

export const UncheckedFlippedWithSecondary: Story = {
  args: {
    checked: false,
    flipped: true,
    showLine2: true,
    label: 'Label',
    secondaryText: 'Secondary text',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=761-108920',
    },
  },
};

export const CheckedFlippedWithSecondary: Story = {
  args: {
    checked: true,
    flipped: true,
    showLine2: true,
    label: 'Label',
    secondaryText: 'Secondary text',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=761-108934',
    },
  },
};

// type import removed:  Meta, StoryObj  from '@storybook/react';
import { RichCheckboxGroup } from './RichCheckboxGroup';

const meta = {
  component: RichCheckboxGroup,
  title: 'Obra/RichCheckboxGroup',
  tags: ['autodocs'],
};

export default meta;


export const UncheckedNormal = {
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

export const CheckedNormal = {
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

export const UncheckedFlipped = {
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

export const CheckedFlipped = {
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

export const UncheckedNormalWithSecondary = {
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

export const CheckedNormalWithSecondary = {
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

export const UncheckedFlippedWithSecondary = {
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

export const CheckedFlippedWithSecondary = {
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

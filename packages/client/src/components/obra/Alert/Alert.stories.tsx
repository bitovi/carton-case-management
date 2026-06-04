// type import removed:  Meta, StoryObj  from '@storybook/react';
import { Info, AlertCircle } from 'lucide-react';
import { Alert } from './Alert';

const meta = {
  component: Alert,
  title: 'Obra/Alert',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=58-5416&t=I5A0QLIu4RNqO53t-4',
    },
  },
};

export default meta;


export const Default = {
  args: {
    children: 'Line 1',
  },
};

export const NeutralWithIcon = {
  args: {
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
  },
};

export const NeutralWithIconAndDescription = {
  args: {
    children: 'Line 1',
    description: 'Line 2',
    showLine2: true,
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
  },
};

export const NeutralFlippedIcon = {
  args: {
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
  },
};

export const NeutralWithButton = {
  args: {
    children: 'Line 1',
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};

export const Error = {
  args: {
    type: 'Error',
    children: 'Line 1',
  },
};

export const ErrorWithIcon = {
  args: {
    type: 'Error',
    children: 'Line 1',
    icon: <AlertCircle className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
  },
};

export const ErrorWithIconAndDescription = {
  args: {
    type: 'Error',
    children: 'Line 1',
    description: 'Line 2',
    showLine2: true,
    icon: <AlertCircle className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
  },
};

export const ErrorFlippedIcon = {
  args: {
    type: 'Error',
    children: 'Line 1',
    icon: <AlertCircle className="h-4 w-4" />,
    showIcon: true,
    flipIcon: false,
  },
};

export const ErrorWithButton = {
  args: {
    type: 'Error',
    children: 'Line 1',
    icon: <AlertCircle className="h-4 w-4" />,
    showIcon: true,
    flipIcon: true,
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};

export const Complete = {
  args: {
    children: 'Line 1',
    description: 'Line 2',
    showLine2: true,
    icon: <Info className="h-4 w-4" />,
    showIcon: true,
    action: (
      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm hover:bg-accent">
        Label
      </button>
    ),
    showButton: true,
  },
};

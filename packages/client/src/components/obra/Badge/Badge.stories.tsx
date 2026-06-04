// type import removed:  Meta, StoryObj  from '@storybook/react';
import { Badge } from './Badge';
import { Check, X, AlertCircle } from 'lucide-react';

const meta = {
  component: Badge,
  title: 'Obra/Badge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Visual style variant',
    },
    roundness: {
      control: 'select',
      options: ['default', 'round'],
      description: 'Border radius style',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
};

export default meta;


export const Primary = {
  args: {
    variant: 'primary',
    children: 'Label',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Label',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Label',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Label',
  },
};

export const Destructive = {
  args: {
    variant: 'destructive',
    children: 'Label',
  },
};

export const RoundPrimary = {
  args: {
    variant: 'primary',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundSecondary = {
  args: {
    variant: 'secondary',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundOutline = {
  args: {
    variant: 'outline',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundGhost = {
  args: {
    variant: 'ghost',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundDestructive = {
  args: {
    variant: 'destructive',
    roundness: 'round',
    children: 'Label',
  },
};

export const WithIconLeft = {
  args: {
    variant: 'primary',
    children: 'Label',
    iconLeft: <Check size={12} />,
  },
};

export const WithIconRight = {
  args: {
    variant: 'secondary',
    children: 'Label',
    iconRight: <X size={12} />,
  },
};

export const DestructiveWithIcon = {
  args: {
    variant: 'destructive',
    roundness: 'round',
    children: 'Error',
    iconLeft: <AlertCircle size={12} />,
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary" roundness="round">
          Primary Round
        </Badge>
        <Badge variant="secondary" roundness="round">
          Secondary Round
        </Badge>
        <Badge variant="outline" roundness="round">
          Outline Round
        </Badge>
        <Badge variant="ghost" roundness="round">
          Ghost Round
        </Badge>
        <Badge variant="destructive" roundness="round">
          Destructive Round
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary" iconLeft={<Check size={12} />}>
          With Icon
        </Badge>
        <Badge variant="secondary" iconRight={<X size={12} />}>
          With Icon
        </Badge>
        <Badge
          variant="outline"
          iconLeft={<Check size={12} />}
          iconRight={<X size={12} />}
        >
          Both Icons
        </Badge>
        <Badge variant="destructive" iconLeft={<AlertCircle size={12} />}>
          Error
        </Badge>
      </div>
    </div>
  ),
};


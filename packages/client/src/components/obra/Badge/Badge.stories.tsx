import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { SvgIcon } from '@progress/kendo-react-common';
import { checkIcon, xIcon, exclamationCircleIcon } from '@progress/kendo-svg-icons';

const meta: Meta<typeof Badge> = {
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
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Label',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Label',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Label',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Label',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Label',
  },
};

export const RoundPrimary: Story = {
  args: {
    variant: 'primary',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundSecondary: Story = {
  args: {
    variant: 'secondary',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundOutline: Story = {
  args: {
    variant: 'outline',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundGhost: Story = {
  args: {
    variant: 'ghost',
    roundness: 'round',
    children: 'Label',
  },
};

export const RoundDestructive: Story = {
  args: {
    variant: 'destructive',
    roundness: 'round',
    children: 'Label',
  },
};

export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    children: 'Label',
    iconLeft: <SvgIcon icon={checkIcon} size="small" />,
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'secondary',
    children: 'Label',
    iconRight: <SvgIcon icon={xIcon} size="small" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'outline',
    children: 'Label',
    iconLeft: <SvgIcon icon={checkIcon} size="small" />,
    iconRight: <SvgIcon icon={xIcon} size="small" />,
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    variant: 'destructive',
    roundness: 'round',
    children: 'Error',
    iconLeft: <SvgIcon icon={exclamationCircleIcon} size="small" />,
  },
};

export const AllVariants: Story = {
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
        <Badge variant="primary" iconLeft={<SvgIcon icon={checkIcon} size="small" />}>
          With Icon
        </Badge>
        <Badge variant="secondary" iconRight={<SvgIcon icon={xIcon} size="small" />}>
          With Icon
        </Badge>
        <Badge
          variant="outline"
          iconLeft={<SvgIcon icon={checkIcon} size="small" />}
          iconRight={<SvgIcon icon={xIcon} size="small" />}
        >
          Both Icons
        </Badge>
        <Badge
          variant="destructive"
          iconLeft={<SvgIcon icon={exclamationCircleIcon} size="small" />}
        >
          Error
        </Badge>
      </div>
    </div>
  ),
};

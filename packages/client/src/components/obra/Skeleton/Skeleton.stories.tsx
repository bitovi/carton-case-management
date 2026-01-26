import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: 'Obra/Skeleton',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246698&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    className: 'h-24 w-full',
  },
};

export const Avatar: Story = {
  args: {
    variant: 'avatar',
  },
};

export const AvatarLarge: Story = {
  args: {
    variant: 'avatar',
    className: 'h-16 w-16',
  },
};

export const Line: Story = {
  args: {
    variant: 'line',
  },
};

export const LineHalfWidth: Story = {
  args: {
    variant: 'line',
    className: 'w-1/2',
  },
};

export const Object: Story = {
  args: {
    variant: 'object',
    className: 'h-48 w-full',
  },
};

export const TextLines: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton variant="line" />
      <Skeleton variant="line" className="w-3/4" />
      <Skeleton variant="line" className="w-1/2" />
    </div>
  ),
};

export const UserProfileCard: Story = {
  render: () => (
    <div className="space-y-4 p-4 border border-border rounded-lg">
      <div className="flex items-center gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="line" className="w-1/4" />
          <Skeleton variant="line" className="w-3/4" />
        </div>
      </div>
      <Skeleton variant="object" className="h-32 w-full" />
    </div>
  ),
};

export const ListItems: Story = {
  render: () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="avatar" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="line" className="w-1/3" />
            <Skeleton variant="line" className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Circle: Story = {
  args: {
    className: 'h-12 w-12 rounded-full',
  },
};

export const Card: Story = {
  render: () => (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  ),
};

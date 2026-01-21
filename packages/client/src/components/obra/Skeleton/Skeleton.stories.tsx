import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: 'Obra/Skeleton',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=303-246601',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'line', 'object', 'avatar'],
      description: 'Visual variant of the skeleton',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the avatar (only applies when variant="avatar")',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for sizing',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/**
 * Default skeleton - a generic block placeholder.
 * Use className to control dimensions.
 */
export const Default: Story = {
  args: {
    className: 'h-4 w-[250px]',
  },
};

/**
 * Line variant - thin bar for text placeholders.
 * Maps to Figma's SkeletonPlaceholderLine.
 */
export const Line: Story = {
  args: {
    variant: 'line',
    className: 'w-[250px]',
  },
};

/**
 * Object variant - rectangle for cards, images, media.
 * Maps to Figma's SkeletonPlaceholderObject.
 */
export const Object: Story = {
  args: {
    variant: 'object',
    className: 'h-32 w-64',
  },
};

/**
 * Avatar variant (small) - 32x32px circle.
 */
export const AvatarSmall: Story = {
  args: {
    variant: 'avatar',
    size: 'sm',
  },
};

/**
 * Avatar variant (medium) - 48x48px circle.
 * Maps to Figma's SkeletonPlaceholderAvatar.
 */
export const AvatarMedium: Story = {
  args: {
    variant: 'avatar',
    size: 'md',
  },
};

/**
 * Avatar variant (large) - 64x64px circle.
 */
export const AvatarLarge: Story = {
  args: {
    variant: 'avatar',
    size: 'lg',
  },
};

/**
 * Card loading pattern - composite example from Figma.
 * Combines avatar + lines + object placeholder.
 */
export const CardLoading: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="avatar" />
        <div className="flex flex-col gap-2">
          <Skeleton variant="line" className="w-64" />
          <Skeleton variant="line" className="w-48" />
        </div>
      </div>
      <Skeleton variant="object" className="h-32 w-full" />
    </div>
  ),
};

/**
 * Profile loading - user profile skeleton pattern.
 */
export const ProfileLoading: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton variant="avatar" size="lg" />
      <div className="space-y-2">
        <Skeleton variant="line" className="w-[200px]" />
        <Skeleton variant="line" className="w-[150px]" />
      </div>
    </div>
  ),
};

/**
 * List loading - multiple rows skeleton pattern.
 */
export const ListLoading: Story = {
  render: () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="avatar" size="sm" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="line" className="w-3/4" />
            <Skeleton variant="line" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Text block loading - paragraph placeholder.
 */
export const TextBlockLoading: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Skeleton variant="line" className="w-full" />
      <Skeleton variant="line" className="w-full" />
      <Skeleton variant="line" className="w-4/5" />
      <Skeleton variant="line" className="w-3/5" />
    </div>
  ),
};

/**
 * Table row loading pattern.
 */
export const TableRowLoading: Story = {
  render: () => (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded border p-3">
          <Skeleton variant="avatar" size="sm" />
          <Skeleton variant="line" className="w-[150px]" />
          <Skeleton variant="line" className="w-[100px]" />
          <Skeleton variant="line" className="w-[80px]" />
          <Skeleton className="ml-auto h-8 w-16" />
        </div>
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Obra/Avatar',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Avatar size',
    },
    src: { control: 'text', description: 'Image source URL' },
    alt: { control: 'text', description: 'Image alt text' },
    fallback: { control: 'text', description: 'Text shown when no image' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithFallback: Story = {
  args: {
    fallback: 'JD',
    alt: 'John Doe',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/80',
    alt: 'User avatar',
  },
};

export const Small: Story = {
  args: {
    fallback: 'AB',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    fallback: 'AB',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    fallback: 'AB',
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="AB" size="sm" />
      <Avatar fallback="AB" size="md" />
      <Avatar fallback="AB" size="lg" />
    </div>
  ),
};

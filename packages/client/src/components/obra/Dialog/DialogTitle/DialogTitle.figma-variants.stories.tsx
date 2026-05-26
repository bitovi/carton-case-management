import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '../Dialog';
import { DialogTitle } from './DialogTitle';

const meta = {
  title: 'Figma Variants/DialogTitle',
  component: DialogTitle,
  decorators: [
    (Story) => (
      <Dialog open onOpenChange={() => {}}>
        <Story />
      </Dialog>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DialogTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Dialog Title',
  },
};

export const WithCustomText: Story = {
  args: {
    children: 'Custom Dialog Title Text',
  },
};

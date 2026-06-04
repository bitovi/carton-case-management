import type { Meta, StoryObj } from '@storybook/react';
import { EditControls } from './EditControls';

const meta = {
  title: 'Figma Variants/EditControls',
  component: EditControls,
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 120, height: 60 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  args: {
    onSave: () => {},
    onCancel: () => {},
  },
} as Meta<typeof EditControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateDefault: Story = {};

export const StateHoverSave: Story = {
  play: async ({ canvasElement }) => {
    const saveBtn = canvasElement.querySelector('button[aria-label="Save"]');
    if (saveBtn) {
      saveBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (saveBtn as HTMLElement).classList.add('hover');
    }
  },
};

export const StateHoverCancel: Story = {
  play: async ({ canvasElement }) => {
    const cancelBtn = canvasElement.querySelector('button[aria-label="Cancel"]');
    if (cancelBtn) {
      cancelBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (cancelBtn as HTMLElement).classList.add('hover');
    }
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CustomerListDialog } from './CustomerListDialog';

const meta = {
  title: 'Components/CustomerListDialog',
  component: CustomerListDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomerListDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function CustomerListDialogWrapper() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Customer List Dialog</button>
      <CustomerListDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export const Default: Story = {
  render: () => <CustomerListDialogWrapper />,
  args: {
    open: false,
    onOpenChange: () => {},
  },
};

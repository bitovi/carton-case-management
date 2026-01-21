import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sheet } from './Sheet';
import { Button } from '@/components/obra/Button';

const meta: Meta<typeof Sheet> = {
  component: Sheet,
  title: 'Obra/Sheet',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=301-243233',
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the sheet is open',
    },
    scrollable: {
      control: 'boolean',
      description: 'Whether to show close button and footer (Figma: Scrollable variant)',
    },
    side: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Side from which the sheet slides in',
    },
    cancelLabel: {
      control: 'text',
      description: 'Label for cancel button (scrollable=true only)',
    },
    actionLabel: {
      control: 'text',
      description: 'Label for action button (scrollable=true only)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

// Interactive wrapper for stories
const SheetDemo = ({
  scrollable = true,
  side = 'right',
  cancelLabel = 'Cancel',
  actionLabel = 'Submit',
}: {
  scrollable?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  cancelLabel?: string;
  actionLabel?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        scrollable={scrollable}
        side={side}
        cancelLabel={cancelLabel}
        actionLabel={actionLabel}
        onAction={() => {
          console.log('Action clicked');
          setOpen(false);
        }}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sheet Content</h2>
          <p className="text-neutral-600">
            This is the content area of the sheet. You can put any content here.
          </p>
        </div>
      </Sheet>
    </div>
  );
};

/**
 * Default scrollable sheet with close button and footer actions.
 * @figma Scrollable=True
 */
export const ScrollableTrue: Story = {
  render: () => <SheetDemo scrollable={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Sheet with close button (top-right) and footer with action buttons. Figma variant: Scrollable=True',
      },
    },
  },
};

/**
 * Simple sheet with just content slot, no chrome.
 * @figma Scrollable=False
 */
export const ScrollableFalse: Story = {
  render: () => <SheetDemo scrollable={false} />,
  parameters: {
    docs: {
      description: {
        story: 'Sheet with just content slot - no close button, no footer. Figma variant: Scrollable=False',
      },
    },
  },
};

/**
 * Sheet sliding from the left side.
 */
export const SideLeft: Story = {
  render: () => <SheetDemo side="left" />,
  parameters: {
    docs: {
      description: {
        story: 'Sheet that slides in from the left edge of the screen.',
      },
    },
  },
};

/**
 * Sheet sliding from the right side (default).
 */
export const SideRight: Story = {
  render: () => <SheetDemo side="right" />,
  parameters: {
    docs: {
      description: {
        story: 'Sheet that slides in from the right edge of the screen (default).',
      },
    },
  },
};

/**
 * Sheet with custom button labels.
 */
export const CustomLabels: Story = {
  render: () => (
    <SheetDemo
      cancelLabel="Discard"
      actionLabel="Save Changes"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sheet with custom cancel and action button labels.',
      },
    },
  },
};

/**
 * Sheet with form content example.
 */
export const WithFormContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="min-h-screen bg-neutral-100 p-8">
        <Button onClick={() => setOpen(true)}>Edit Profile</Button>

        <Sheet
          open={open}
          onOpenChange={setOpen}
          scrollable={true}
          cancelLabel="Cancel"
          actionLabel="Save"
          onAction={() => {
            console.log('Profile saved');
            setOpen(false);
          }}
        >
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <p className="text-sm text-neutral-500">
              Make changes to your profile here.
            </p>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>
        </Sheet>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a sheet used for editing profile information with form fields.',
      },
    },
  },
};

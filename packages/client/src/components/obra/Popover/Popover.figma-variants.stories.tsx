import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '@/components/obra/Button';

// # 6 Get Component Context and Implement in Figma
// ## 6.1 Get Component Context
// ### 6.1.2 Generate Variant Stories

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'Figma Variants/Popover',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popover displays rich content in a floating container anchored to a trigger element.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=2322-135488',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

// ============================================================================
// CLOSED STATE VARIANTS
// ============================================================================

function ClosedStateWrapper() {
  return (
    <Popover open={false}>
      <PopoverTrigger asChild>
        <Button variant="outline">Click to open (closed state shown)</Button>
      </PopoverTrigger>
      <PopoverContent>Popover content</PopoverContent>
    </Popover>
  );
}

export const ClosedState: Story = {
  render: () => <ClosedStateWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Closed state - popover is hidden. open=false, data-state="closed"',
      },
    },
  },
};

// ============================================================================
// POSITION VARIANTS (Open State, Default Content, No Header)
// ============================================================================

function PositionWrapper({ side, align }: { side: 'top' | 'right' | 'bottom' | 'left'; align: 'start' | 'center' | 'end' }) {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">{`${side} (${align})`}</Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <p className="text-sm">Popover content</p>
      </PopoverContent>
    </Popover>
  );
}

export const PositionTopStart: Story = {
  render: () => <PositionWrapper side="top" align="start" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: top, Align: start',
      },
    },
  },
};

export const PositionTopCenter: Story = {
  render: () => <PositionWrapper side="top" align="center" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: top, Align: center',
      },
    },
  },
};

export const PositionTopEnd: Story = {
  render: () => <PositionWrapper side="top" align="end" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: top, Align: end',
      },
    },
  },
};

export const PositionRightStart: Story = {
  render: () => <PositionWrapper side="right" align="start" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: right, Align: start',
      },
    },
  },
};

export const PositionRightCenter: Story = {
  render: () => <PositionWrapper side="right" align="center" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: right, Align: center',
      },
    },
  },
};

export const PositionRightEnd: Story = {
  render: () => <PositionWrapper side="right" align="end" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: right, Align: end',
      },
    },
  },
};

export const PositionBottomStart: Story = {
  render: () => <PositionWrapper side="bottom" align="start" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: bottom, Align: start',
      },
    },
  },
};

export const PositionBottomCenter: Story = {
  render: () => <PositionWrapper side="bottom" align="center" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: bottom, Align: center',
      },
    },
  },
};

export const PositionBottomEnd: Story = {
  render: () => <PositionWrapper side="bottom" align="end" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: bottom, Align: end',
      },
    },
  },
};

export const PositionLeftStart: Story = {
  render: () => <PositionWrapper side="left" align="start" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: left, Align: start',
      },
    },
  },
};

export const PositionLeftCenter: Story = {
  render: () => <PositionWrapper side="left" align="center" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: left, Align: center',
      },
    },
  },
};

export const PositionLeftEnd: Story = {
  render: () => <PositionWrapper side="left" align="end" />,
  parameters: {
    docs: {
      description: {
        story: 'Position: left, Align: end',
      },
    },
  },
};

// ============================================================================
// CONTENT VARIANTS (Open State, Bottom/Center Position)
// ============================================================================

function ContentDefaultWrapper() {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Default Content</Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-80">
        <p className="text-sm">This is popover content with default padding (16px) and max-width (400px)</p>
      </PopoverContent>
    </Popover>
  );
}

export const ContentDefault: Story = {
  render: () => <ContentDefaultWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Content variant: default - Shows standard padding (16px) and max-width styling',
      },
    },
  },
};

function ContentMenuWrapper() {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Menu Content</Button>
      </PopoverTrigger>
      <PopoverContent content="Menu" side="bottom" align="center" className="w-auto">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="small" className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal">
            Option 1
          </Button>
          <Button variant="ghost" size="small" className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal">
            Option 2
          </Button>
          <Button variant="ghost" size="small" className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal">
            Option 3
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const ContentMenu: Story = {
  render: () => <ContentMenuWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Content variant: Menu - Shows compact padding (8px) optimized for menu-style items. No header shown for Menu variant.',
      },
    },
  },
};

// ============================================================================
// HEADER VARIANTS (Open State, Bottom/Center Position, Default Content)
// ============================================================================

function HeaderWithTitleAndDescWrapper() {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">With Header</Button>
      </PopoverTrigger>
      <PopoverContent 
        side="bottom" 
        align="center" 
        className="w-80"
        headerTitle="Popover Title"
        headerDescription="Optional description"
      >
        <p className="text-sm">Popover content</p>
      </PopoverContent>
    </Popover>
  );
}

export const HeaderWithTitleAndDescription: Story = {
  render: () => <HeaderWithTitleAndDescWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Header variant: With title and description. Header is shown above content for non-Menu variants.',
      },
    },
  },
};

function HeaderWithoutHeaderWrapper() {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Without Header</Button>
      </PopoverTrigger>
      <PopoverContent 
        side="bottom" 
        align="center" 
        className="w-80"
      >
        <p className="text-sm">Popover content fills full popover without header spacing</p>
      </PopoverContent>
    </Popover>
  );
}

export const HeaderWithoutHeader: Story = {
  render: () => <HeaderWithoutHeaderWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Header variant: Without header. Content fills full popover without extra header spacing.',
      },
    },
  },
};

// ============================================================================
// COMBINED VARIANTS (Complex scenarios)
// ============================================================================

function ComplexWithHeaderAndPositionWrapper() {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Top Start + Header</Button>
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="start" 
        className="w-80"
        headerTitle="Settings"
        headerDescription="Configure your preferences"
      >
        <div className="space-y-3">
          <p className="text-sm">Popover content with header and custom positioning</p>
          <Button size="small" variant="primary">Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const ComplexTopStartWithHeader: Story = {
  render: () => <ComplexWithHeaderAndPositionWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Complex variant: Positioned at top-start with header title and description',
      },
    },
  },
};

function ComplexMenuWithPositionWrapper() {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Right Center + Menu</Button>
      </PopoverTrigger>
      <PopoverContent 
        content="Menu" 
        side="right" 
        align="center" 
        className="w-auto"
      >
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="small" className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal">
            Edit
          </Button>
          <Button variant="ghost" size="small" className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal">
            Delete
          </Button>
          <Button variant="ghost" size="small" className="w-full justify-start gap-3 px-3 py-2 text-sm font-normal">
            Share
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const ComplexRightCenterWithMenu: Story = {
  render: () => <ComplexMenuWithPositionWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Complex variant: Positioned at right-center with Menu content variant',
      },
    },
  },
};

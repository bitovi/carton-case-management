import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Mail, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Figma Variants/SelectItem',
  component: SelectItem,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SelectItem>;

export default meta;
type Story = StoryObj<typeof meta>;

interface SelectItemPreviewProps {
  size?: 'regular' | 'large';
  type?: 'default' | 'destructive';
  disabled?: boolean;
  checked?: boolean;
  leftDecoration?: ReactNode;
  rightDecoration?: ReactNode;
  description?: string;
  children?: ReactNode;
}

function SelectItemPreview({
  size = 'regular',
  type = 'default',
  disabled = false,
  checked = false,
  leftDecoration,
  rightDecoration,
  description,
  children = 'Item',
}: SelectItemPreviewProps) {
  return (
    <div className="w-[320px] p-6">
      <Select open value={checked ? 'item-main' : ''} onValueChange={() => undefined}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="item-main"
            size={size}
            type={type}
            disabled={disabled}
            leftDecoration={leftDecoration}
            rightDecoration={rightDecoration}
            description={description}
          >
            {children}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export const SizeRegularTypeDefaultStateDefault: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    children: 'Item'
  }
};

export const SizeRegularTypeDefaultStateHover: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    }
  }
};

export const SizeRegularTypeDefaultStateFocus: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.focus();
    }
  }
};

export const SizeRegularTypeDefaultStateChecked: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    checked: true,
    children: 'Item'
  }
};

export const SizeRegularTypeDefaultStateDisabled: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    disabled: true,
    children: 'Item'
  }
};

export const SizeRegularTypeDestructiveStateDefault: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'destructive',
    children: 'Item'
  }
};

export const SizeRegularTypeDestructiveStateHover: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'destructive',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    }
  }
};

export const SizeRegularTypeDestructiveStateFocus: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'destructive',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.focus();
    }
  }
};

export const SizeRegularTypeDestructiveStateChecked: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'destructive',
    checked: true,
    children: 'Item'
  }
};

export const SizeRegularTypeDestructiveStateDisabled: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'destructive',
    disabled: true,
    children: 'Item'
  }
};

export const SizeLargeTypeDefaultStateDefault: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'default',
    children: 'Item'
  }
};

export const SizeLargeTypeDefaultStateHover: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'default',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    }
  }
};

export const SizeLargeTypeDefaultStateFocus: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'default',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.focus();
    }
  }
};

export const SizeLargeTypeDefaultStateChecked: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'default',
    checked: true,
    children: 'Item'
  }
};

export const SizeLargeTypeDefaultStateDisabled: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'default',
    disabled: true,
    children: 'Item'
  }
};

export const SizeLargeTypeDestructiveStateDefault: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'destructive',
    children: 'Item'
  }
};

export const SizeLargeTypeDestructiveStateHover: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'destructive',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    }
  }
};

export const SizeLargeTypeDestructiveStateFocus: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'destructive',
    children: 'Item'
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[role="option"]') || canvasElement.firstElementChild;
    if (item) {
      item.focus();
    }
  }
};

export const SizeLargeTypeDestructiveStateChecked: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'destructive',
    checked: true,
    children: 'Item'
  }
};

export const SizeLargeTypeDestructiveStateDisabled: Story = {
  render: SelectItemPreview,
  args: {
    size: 'large',
    type: 'destructive',
    disabled: true,
    children: 'Item'
  }
};

export const WithLeftDecoration: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    leftDecoration: <User className="w-4 h-4" />,
    children: 'Item'
  }
};

export const WithRightDecoration: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    rightDecoration: <Mail className="w-4 h-4" />,
    children: 'Item'
  }
};

export const WithLeftAndRightDecoration: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    leftDecoration: <User className="w-4 h-4" />,
    rightDecoration: <Mail className="w-4 h-4" />,
    children: 'Item'
  }
};

export const WithDescription: Story = {
  render: SelectItemPreview,
  args: {
    size: 'regular',
    type: 'default',
    description: 'Description',
    children: 'Item'
  }
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from './Select';
import { User, Mail, Settings, Trash2 } from 'lucide-react';

const meta = {
  title: 'Obra/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

interface InteractiveSelectProps {
  value?: string;
  children?: ReactNode;
}

function InteractiveSelect({ value: initialValue, children }: InteractiveSelectProps) {
  const [value, setValue] = useState(initialValue || '');
  
  return (
    <Select value={value} onValueChange={setValue}>
      {children}
    </Select>
  );
}

export const Default: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
          <SelectItem value="item3">Item 3</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const StackedLayout: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger layout="stacked" label="Category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tech">Technology</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithIcons: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger leftDecoration={<User className="w-4 h-4" />}>
          <SelectValue placeholder="Select a setting" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user" leftDecoration={<User className="w-4 h-4" />}>
            User Settings
          </SelectItem>
          <SelectItem value="mail" leftDecoration={<Mail className="w-4 h-4" />}>
            Mail Settings
          </SelectItem>
          <SelectItem value="settings" leftDecoration={<Settings className="w-4 h-4" />}>
            System Settings
          </SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithGroups: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent spacing="8px">
          <SelectLabel size="small">Recent</SelectLabel>
          <SelectItem value="recent1">Recent Item 1</SelectItem>
          <SelectItem value="recent2">Recent Item 2</SelectItem>
          
          <SelectSeparator />
          
          <SelectLabel size="small">All Items</SelectLabel>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
          <SelectItem value="item3">Item 3</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithDestructiveAction: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="edit">Edit</SelectItem>
          <SelectItem value="duplicate">Duplicate</SelectItem>
          <SelectItem value="share">Share</SelectItem>
          
          <SelectSeparator />
          
          <SelectItem value="delete" type="destructive" leftDecoration={<Trash2 className="w-4 h-4" />}>
            Delete
          </SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const ErrorState: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger error>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
          <SelectItem value="item3">Item 3</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const Disabled: Story = {
  render: InteractiveSelect,
  args: {
    children: (
      <>
        <SelectTrigger disabled>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="w-full max-w-[1840px] p-8 bg-background">
      <div className="grid grid-cols-5 gap-6">
        <div className="text-xs font-semibold text-muted-foreground">Placeholder</div>
        <div className="text-xs font-semibold text-muted-foreground">Default</div>
        <div className="text-xs font-semibold text-muted-foreground">Focus</div>
        <div className="text-xs font-semibold text-muted-foreground">Error</div>
        <div className="text-xs font-semibold text-muted-foreground">Disabled</div>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Regular</div>
          <Select>
            <SelectTrigger size="regular" layout="single">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
              <SelectItem value="2">Item 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Select defaultValue="item1">
          <SelectTrigger size="regular" layout="single">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="regular" layout="single" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="regular" layout="single" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="regular" layout="single" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Text</div>
          <Select>
            <SelectTrigger size="regular" layout="stacked" label="Text">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="item1">
          <SelectTrigger size="regular" layout="stacked" label="Text">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="regular" layout="stacked" label="Text" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="regular" layout="stacked" label="Text" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="regular" layout="stacked" label="Text" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Large</div>
          <Select>
            <SelectTrigger size="large" layout="single">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="item1">
          <SelectTrigger size="large" layout="single">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="large" layout="single" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="large" layout="single" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="large" layout="single" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Text</div>
          <Select>
            <SelectTrigger size="large" layout="stacked" label="Text">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="item1">
          <SelectTrigger size="large" layout="stacked" label="Text">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="large" layout="stacked" label="Text" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="large" layout="stacked" label="Text" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="large" layout="stacked" label="Text" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Small</div>
          <Select>
            <SelectTrigger size="small" layout="single">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="item1">
          <SelectTrigger size="small" layout="single">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="small" layout="single" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="small" layout="single" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="small" layout="single" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Text</div>
          <Select>
            <SelectTrigger size="small" layout="stacked" label="Text">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="item1">
          <SelectTrigger size="small" layout="stacked" label="Text">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="small" layout="stacked" label="Text" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="small" layout="stacked" label="Text" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="small" layout="stacked" label="Text" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Mini</div>
          <Select>
            <SelectTrigger size="mini" layout="single">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="item1">
          <SelectTrigger size="mini" layout="single">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="mini" layout="single" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="mini" layout="single" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="mini" layout="single" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Text</div>
          <Select>
            <SelectTrigger size="mini" layout="stacked" label="Text">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="item1">
          <SelectTrigger size="mini" layout="stacked" label="Text">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="mini" layout="stacked" label="Text" className="ring-2 ring-[var(--ring)]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="item1">
          <SelectTrigger size="mini" layout="stacked" label="Text" error>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="item1">
          <SelectTrigger size="mini" layout="stacked" label="Text" disabled>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

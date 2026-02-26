import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Input } from './Input';
import { SvgIcon } from '@progress/kendo-react-common';
import { searchIcon, xIcon, envelopeIcon } from '@progress/kendo-svg-icons';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Obra/Input',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1738&m=dev',
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', 'small', 'regular', 'large'],
    },
    roundness: {
      control: 'select',
      options: ['default', 'round'],
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        leftDecoration={
          <SvgIcon icon={searchIcon} size="small" className="text-muted-foreground" />
        }
        placeholder="Left icon (search)"
      />
      <Input
        rightDecoration={
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <SvgIcon icon={xIcon} size="small" />
          </button>
        }
        placeholder="Right icon (clear)"
      />
      <Input
        leftDecoration={
          <SvgIcon icon={envelopeIcon} size="small" className="text-muted-foreground" />
        }
        rightDecoration={
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <SvgIcon icon={xIcon} size="small" />
          </button>
        }
        placeholder="Both icons"
      />
    </div>
  ),
};

export const Error: Story = {
  args: {
    error: true,
    value: 'invalid@',
    placeholder: 'Invalid input',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Read-only value',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input placeholder="Empty/Placeholder" />
      <Input value="With Value" readOnly />
      <Input placeholder="Error state" error />
      <Input value="Error with value" error readOnly />
      <Input placeholder="Disabled" disabled />
      <Input value="Disabled with value" disabled />
    </div>
  ),
};

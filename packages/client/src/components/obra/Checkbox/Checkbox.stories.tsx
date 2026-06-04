// type import removed:  Meta, StoryObj  from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  component: Checkbox,
  title: 'Obra/Checkbox',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1790&m=dev',
    },
  },
  argTypes: {
    checked: {
      control: { type: 'select' },
      options: [false, true, 'indeterminate'],
    },
  },
};

export default meta;


export const Default = {
  args: {
    checked: false,
  },
};

export const Checked = {
  args: {
    checked: true,
  },
};

export const Indeterminate = {
  args: {
    checked: 'indeterminate',
  },
};

export const UncheckedWithError = {
  args: {
    checked: false,
    error: true,
  },
};

export const CheckedWithError = {
  args: {
    checked: true,
    error: true,
  },
};

export const UncheckedDisabled = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const CheckedDisabled = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const IndeterminateDisabled = {
  args: {
    checked: 'indeterminate',
    disabled: true,
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Unchecked States</h3>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked={false} />
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked={false} error />
            <span className="text-xs text-muted-foreground">Error</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked={false} disabled />
            <span className="text-xs text-muted-foreground">Disabled</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Checked States</h3>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked={true} />
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked={true} error />
            <span className="text-xs text-muted-foreground">Error</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked={true} disabled />
            <span className="text-xs text-muted-foreground">Disabled</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Indeterminate States</h3>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked="indeterminate" />
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox checked="indeterminate" disabled />
            <span className="text-xs text-muted-foreground">Disabled</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

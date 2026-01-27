import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Trash2, Download } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Obra/Button',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=9-1071&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-x-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost-muted">Ghost Muted</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="space-x-2">
        <Button leftIcon={<Plus size={16} />}>Left Icon</Button>
        <Button rightIcon={<Download size={16} />}>Right Icon</Button>
        <Button leftIcon={<Plus size={16} />} rightIcon={<Download size={16} />}>
          Both Icons
        </Button>
        <Button leftIcon={<Trash2 size={16} />} aria-label="Delete item" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const VariantMatrix: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Large</h3>
        <div className="space-x-2">
          <Button size="large" variant="primary">
            Primary
          </Button>
          <Button size="large" variant="secondary">
            Secondary
          </Button>
          <Button size="large" variant="outline">
            Outline
          </Button>
          <Button size="large" variant="ghost">
            Ghost
          </Button>
          <Button size="large" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="large" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Regular</h3>
        <div className="space-x-2">
          <Button size="regular" variant="primary">
            Primary
          </Button>
          <Button size="regular" variant="secondary">
            Secondary
          </Button>
          <Button size="regular" variant="outline">
            Outline
          </Button>
          <Button size="regular" variant="ghost">
            Ghost
          </Button>
          <Button size="regular" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="regular" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Small</h3>
        <div className="space-x-2">
          <Button size="small" variant="primary">
            Primary
          </Button>
          <Button size="small" variant="secondary">
            Secondary
          </Button>
          <Button size="small" variant="outline">
            Outline
          </Button>
          <Button size="small" variant="ghost">
            Ghost
          </Button>
          <Button size="small" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="small" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Mini</h3>
        <div className="space-x-2">
          <Button size="mini" variant="primary">
            Primary
          </Button>
          <Button size="mini" variant="secondary">
            Secondary
          </Button>
          <Button size="mini" variant="outline">
            Outline
          </Button>
          <Button size="mini" variant="ghost">
            Ghost
          </Button>
          <Button size="mini" variant="ghost-muted">
            Ghost Muted
          </Button>
          <Button size="mini" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>
    </div>
  ),
};


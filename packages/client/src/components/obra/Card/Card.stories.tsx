import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Label } from '../Label';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Obra/Card',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=179-29234&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const HeaderContent = () => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">Card Header</h3>
    <span className="text-sm text-muted-foreground">Optional badge</span>
  </div>
);

const MainContent = () => (
  <div className="space-y-2">
    <p className="text-sm">This is the main content area of the card.</p>
    <p className="text-sm text-muted-foreground">
      It can contain any React components or content.
    </p>
  </div>
);

const FooterContent = () => (
  <div className="flex items-center justify-end gap-2">
    <button className="rounded bg-secondary px-4 py-2 text-sm font-medium">
      Cancel
    </button>
    <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
      Save
    </button>
  </div>
);

export const OneSlot: Story = {
  args: {
    main: <MainContent />,
  },
};

export const TwoSlots: Story = {
  args: {
    header: <HeaderContent />,
    main: <MainContent />,
  },
};

export const ThreeSlots: Story = {
  args: {
    header: <HeaderContent />,
    main: <MainContent />,
    footer: <FooterContent />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      <Card main={<MainContent />} />
      <Card header={<HeaderContent />} main={<MainContent />} />
      <Card
        header={<HeaderContent />}
        main={<MainContent />}
        footer={<FooterContent />}
      />
    </div>
  ),
};

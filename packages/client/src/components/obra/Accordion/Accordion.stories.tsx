import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: 'Obra/Accordion',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-122455&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Is it accessible?',
        content: 'Yes. It adheres to the WAI-ARIA design pattern.',
      },
      {
        value: 'item-2',
        trigger: 'Is it styled?',
        content: 'Yes. It comes with default styles that matches Figma design.',
      },
      {
        value: 'item-3',
        trigger: 'Is it animated?',
        content: 'Yes. It\'s animated by default with smooth expand/collapse transitions.',
      },
    ],
  },
};

export const SingleOpen: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-2',
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section (Open)',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section',
        content: 'Content for third section',
      },
    ],
  },
};

export const MultipleOpen: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1', 'item-3'],
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'First Section (Open)',
        content: 'Content for first section',
      },
      {
        value: 'item-2',
        trigger: 'Second Section',
        content: 'Content for second section',
      },
      {
        value: 'item-3',
        trigger: 'Third Section (Open)',
        content: 'Content for third section',
      },
    ],
  },
};

export const WithRichContent: Story = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[480px]',
    items: [
      {
        value: 'item-1',
        trigger: 'Features',
        content: (
          <ul className="list-disc pl-5 space-y-2">
            <li>Fully accessible with keyboard navigation</li>
            <li>Smooth animations</li>
            <li>Single or multiple items open at once</li>
            <li>Customizable styling</li>
          </ul>
        ),
      },
      {
        value: 'item-2',
        trigger: 'Installation',
        content: (
          <div className="space-y-2">
            <p>Install the component from your terminal:</p>
            <code className="block bg-muted p-2 rounded text-sm">
              npx shadcn@latest add accordion
            </code>
          </div>
        ),
      },
    ],
  },
};

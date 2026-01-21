import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
  SelectSeparator,
} from './index';

const meta: Meta<typeof SelectTrigger> = {
  title: 'Obra/Select',
  component: SelectTrigger,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=281-104714',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelectTrigger>;

/**
 * Default select with standard size
 */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * All trigger size variants
 * Figma nodes: 16:1730 (Default), 19:1478 (Large), 19:1574 (Small), 281:105885 (Mini)
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select>
        <SelectTrigger size="default">
          <SelectValue placeholder="Default (36px)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger size="lg">
          <SelectValue placeholder="Large (40px)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Small (32px)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger size="mini">
          <SelectValue placeholder="Mini (32px, small text)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=16:1730',
    },
  },
};

/**
 * Error state trigger
 * Figma node: 18:980
 */
export const ErrorState: Story = {
  render: () => (
    <Select>
      <SelectTrigger state="error">
        <SelectValue placeholder="Required field" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=18:980',
    },
  },
};

/**
 * Disabled state
 * Figma node: 18:976
 */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger>
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=18:976',
    },
  },
};

/**
 * Two-line trigger variant
 * Figma node: 68:17940
 */
export const TwoLines: Story = {
  render: () => (
    <Select defaultValue="premium">
      <SelectTrigger lines="double">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free" description="Basic features included">
          Free Plan
        </SelectItem>
        <SelectItem value="premium" description="Everything in Free, plus more">
          Premium Plan
        </SelectItem>
        <SelectItem value="enterprise" description="Custom solutions for teams">
          Enterprise Plan
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=68:17940',
    },
  },
};

/**
 * With grouped items and labels
 * Figma nodes: 18:998 (Label), 80:10194 (Regular Label)
 */
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=18:998',
    },
  },
};

/**
 * Small indented labels
 * Figma nodes: 80:10188 (Indented)
 */
export const IndentedLabels: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel>Main Category</SelectLabel>
        <SelectItem value="item1">Item 1</SelectItem>
        <SelectLabel size="sm" indented>
          Subcategory
        </SelectLabel>
        <SelectItem value="sub1">Sub-item 1</SelectItem>
        <SelectItem value="sub2">Sub-item 2</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=80:10188',
    },
  },
};

/**
 * Destructive item variant
 * Figma node: 68:17850
 */
export const DestructiveItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Actions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="edit">Edit</SelectItem>
        <SelectItem value="duplicate">Duplicate</SelectItem>
        <SelectItem value="archive">Archive</SelectItem>
        <SelectSeparator />
        <SelectItem value="delete" variant="destructive">
          Delete
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=68:17850',
    },
  },
};

/**
 * Large item size variant
 * Figma node: 176:26563
 */
export const LargeItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="lg">
        <SelectValue placeholder="Select a team member" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="john" size="lg" description="Engineering Lead">
          John Doe
        </SelectItem>
        <SelectItem value="jane" size="lg" description="Product Manager">
          Jane Smith
        </SelectItem>
        <SelectItem value="bob" size="lg" description="Designer">
          Bob Wilson
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=176:26563',
    },
  },
};

/**
 * With selected value
 */
export const WithValue: Story = {
  render: () => (
    <Select defaultValue="option2">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * With disabled items
 */
export const WithDisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Available Option</SelectItem>
        <SelectItem value="option2" disabled>
          Unavailable Option
        </SelectItem>
        <SelectItem value="option3">Another Available</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Form example with label
 */
export const FormExample: Story = {
  render: () => (
    <div className="grid gap-2">
      <label htmlFor="country" className="text-sm font-medium">
        Country
      </label>
      <Select>
        <SelectTrigger id="country">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Select the country you're located in.
      </p>
    </div>
  ),
};

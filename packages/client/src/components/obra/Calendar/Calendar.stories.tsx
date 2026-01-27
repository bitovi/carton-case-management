/**
 * Calendar Component Stories
 * Storybook stories for the Calendar component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

const meta = {
  title: 'Obra/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-119954&m=dev',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
  args: {
    mode: 'single',
    selected: new Date(2024, 0, 15),
    defaultMonth: new Date(2024, 0, 1),
  },
};


export const TwoMonths: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 2,
    selected: new Date(2024, 0, 15),
    defaultMonth: new Date(2024, 0, 1),
  },
};


export const ThreeMonths: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 3,
    selected: new Date(2024, 0, 15),
    defaultMonth: new Date(2024, 0, 1),
  },
};


export const RangeSelection: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    selected: {
      from: new Date(2024, 0, 10),
      to: new Date(2024, 0, 20),
    },
    defaultMonth: new Date(2024, 0, 1),
  },
};


export const WithDisabledDates: Story = {
  args: {
    mode: 'single',
    selected: new Date(),
    disabled: { before: new Date() },
    defaultMonth: new Date(),
  },
};


export const MultipleSelection: Story = {
  args: {
    mode: 'multiple',
    selected: [
      new Date(2024, 0, 5),
      new Date(2024, 0, 10),
      new Date(2024, 0, 15),
      new Date(2024, 0, 20),
    ],
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const WeekStartsMonday: Story = {
  args: {
    mode: 'single',
    selected: new Date(2024, 0, 15),
    weekStartsOn: 1,
    defaultMonth: new Date(2024, 0, 1),
  },
};

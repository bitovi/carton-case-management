import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

const meta = {
  title: 'Figma Variants/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Months1ModeSingle: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 1,
    selected: new Date(2024, 0, 15),
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const Months1ModeRange: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 1,
    selected: {
      from: new Date(2024, 0, 10),
      to: new Date(2024, 0, 20),
    },
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const Months2ModeSingle: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 2,
    selected: new Date(2024, 0, 15),
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const Months2ModeRange: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    selected: {
      from: new Date(2024, 0, 10),
      to: new Date(2024, 1, 5),
    },
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const Months3ModeSingle: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 3,
    selected: new Date(2024, 0, 15),
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const Months3ModeRange: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 3,
    selected: {
      from: new Date(2024, 0, 10),
      to: new Date(2024, 2, 5),
    },
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const WithDisabledDates: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 1,
    selected: new Date(2024, 0, 20),
    disabled: { before: new Date(2024, 0, 15) },
    defaultMonth: new Date(2024, 0, 1),
  },
};

export const MultipleSelection: Story = {
  args: {
    mode: 'multiple',
    numberOfMonths: 1,
    selected: [
      new Date(2024, 0, 5),
      new Date(2024, 0, 10),
      new Date(2024, 0, 15),
      new Date(2024, 0, 20),
    ],
    defaultMonth: new Date(2024, 0, 1),
  },
};

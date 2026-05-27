import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./Calendar";

const meta = {
  title: "Figma Variants/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseDate = new Date(2024, 0, 15);
const defaultMonth = new Date(2024, 0, 1);

export const NumberOfMonths1ModeSingle: Story = {
  args: {
    numberOfMonths: 1,
    mode: "single",
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths1ModeMultiple: Story = {
  args: {
    numberOfMonths: 1,
    mode: "multiple",
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 0, 25)],
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths1ModeRange: Story = {
  args: {
    numberOfMonths: 1,
    mode: "range",
    selected: { from: new Date(2024, 0, 10), to: new Date(2024, 0, 20) },
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths2ModeSingle: Story = {
  args: {
    numberOfMonths: 2,
    mode: "single",
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths2ModeMultiple: Story = {
  args: {
    numberOfMonths: 2,
    mode: "multiple",
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 1, 10)],
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths2ModeRange: Story = {
  args: {
    numberOfMonths: 2,
    mode: "range",
    selected: { from: new Date(2024, 0, 20), to: new Date(2024, 1, 5) },
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths3ModeSingle: Story = {
  args: {
    numberOfMonths: 3,
    mode: "single",
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths3ModeMultiple: Story = {
  args: {
    numberOfMonths: 3,
    mode: "multiple",
    selected: [new Date(2024, 0, 5), baseDate, new Date(2024, 2, 20)],
    defaultMonth: defaultMonth,
  },
};

export const NumberOfMonths3ModeRange: Story = {
  args: {
    numberOfMonths: 3,
    mode: "range",
    selected: { from: new Date(2024, 0, 15), to: new Date(2024, 2, 15) },
    defaultMonth: defaultMonth,
  },
};

export const ShowOutsideDaysFalse: Story = {
  args: {
    numberOfMonths: 1,
    mode: "single",
    showOutsideDays: false,
    selected: baseDate,
    defaultMonth: defaultMonth,
  },
};

export const SelectionNone: Story = {
  args: {
    numberOfMonths: 1,
    mode: "single",
    defaultMonth: defaultMonth,
  },
};

export const SelectionToday: Story = {
  args: {
    numberOfMonths: 1,
    mode: "single",
    defaultMonth: new Date(),
  },
};

export const SelectionDisabled: Story = {
  args: {
    numberOfMonths: 1,
    mode: "single",
    disabled: { before: new Date() },
    defaultMonth: defaultMonth,
  },
};

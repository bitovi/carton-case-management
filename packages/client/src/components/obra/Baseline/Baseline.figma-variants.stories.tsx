import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Figma Variants/Baseline",
};

export default meta;

type Story = StoryObj;

export const Blank: Story = {
  render: () => <div data-rtf-baseline />,
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { User } from "lucide-react";

const meta = {
  title: "Figma Variants/SelectTrigger",
  component: SelectTrigger,
  parameters: {
    layout: "centered",
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectTriggerWrapper({
  size = "regular",
  layout = "single",
  error = false,
  disabled = false,
  leftDecoration = false,
  prependText = "",
  label = "",
  children = "Select an item",
}: any) {
  const [value, setValue] = useState("");
  return (
    <Select value={value} onValueChange={setValue} disabled={disabled}>
      <SelectTrigger
        size={size}
        layout={layout}
        error={error}
        disabled={disabled}
        label={layout === "stacked" ? (label || undefined) : undefined}
        prependText={layout === "single" ? (prependText || undefined) : undefined}
        leftDecoration={leftDecoration ? <User className="w-4 h-4" /> : undefined}
      >
        <SelectValue placeholder={children as string} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item1">Item 1</SelectItem>
        <SelectItem value="item2">Item 2</SelectItem>
        <SelectItem value="item3">Item 3</SelectItem>
      </SelectContent>
    </Select>
  );
}

const focusPlay = async ({ canvasElement }: any) => {
  const trigger = canvasElement.querySelector('[role="combobox"]');
  if (trigger) (trigger as HTMLElement).focus();
};

export const SizeMiniLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "single",
    error: false,
    disabled: false,
  },
};

export const SizeMiniLayoutSingleErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "single",
    error: false,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeMiniLayoutSingleErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "single",
    error: false,
    disabled: true,
  },
};

export const SizeMiniLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "single",
    error: true,
    disabled: false,
  },
};

export const SizeMiniLayoutSingleErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "single",
    error: true,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeMiniLayoutSingleErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "single",
    error: true,
    disabled: true,
  },
};

export const SizeMiniLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
};

export const SizeMiniLayoutStackedErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeMiniLayoutStackedErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "stacked",
    error: false,
    disabled: true,
    label: "Label",
  },
};

export const SizeMiniLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
};

export const SizeMiniLayoutStackedErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeMiniLayoutStackedErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "mini",
    layout: "stacked",
    error: true,
    disabled: true,
    label: "Label",
  },
};

export const SizeSmallLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "single",
    error: false,
    disabled: false,
  },
};

export const SizeSmallLayoutSingleErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "single",
    error: false,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeSmallLayoutSingleErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "single",
    error: false,
    disabled: true,
  },
};

export const SizeSmallLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "single",
    error: true,
    disabled: false,
  },
};

export const SizeSmallLayoutSingleErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "single",
    error: true,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeSmallLayoutSingleErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "single",
    error: true,
    disabled: true,
  },
};

export const SizeSmallLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
};

export const SizeSmallLayoutStackedErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeSmallLayoutStackedErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "stacked",
    error: false,
    disabled: true,
    label: "Label",
  },
};

export const SizeSmallLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
};

export const SizeSmallLayoutStackedErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeSmallLayoutStackedErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "small",
    layout: "stacked",
    error: true,
    disabled: true,
    label: "Label",
  },
};

export const SizeRegularLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: false,
    disabled: false,
  },
};

export const SizeRegularLayoutSingleErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: false,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeRegularLayoutSingleErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: false,
    disabled: true,
  },
};

export const SizeRegularLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: true,
    disabled: false,
  },
};

export const SizeRegularLayoutSingleErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: true,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeRegularLayoutSingleErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: true,
    disabled: true,
  },
};

export const SizeRegularLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
};

export const SizeRegularLayoutStackedErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeRegularLayoutStackedErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: false,
    disabled: true,
    label: "Label",
  },
};

export const SizeRegularLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
};

export const SizeRegularLayoutStackedErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeRegularLayoutStackedErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: true,
    disabled: true,
    label: "Label",
  },
};

export const SizeLargeLayoutSingleErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "single",
    error: false,
    disabled: false,
  },
};

export const SizeLargeLayoutSingleErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "single",
    error: false,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeLargeLayoutSingleErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "single",
    error: false,
    disabled: true,
  },
};

export const SizeLargeLayoutSingleErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "single",
    error: true,
    disabled: false,
  },
};

export const SizeLargeLayoutSingleErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "single",
    error: true,
    disabled: false,
  },
  play: focusPlay,
};

export const SizeLargeLayoutSingleErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "single",
    error: true,
    disabled: true,
  },
};

export const SizeLargeLayoutStackedErrorFalseStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
};

export const SizeLargeLayoutStackedErrorFalseStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeLargeLayoutStackedErrorFalseStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "stacked",
    error: false,
    disabled: true,
    label: "Label",
  },
};

export const SizeLargeLayoutStackedErrorTrueStateDefault: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
};

export const SizeLargeLayoutStackedErrorTrueStateFocus: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "stacked",
    error: true,
    disabled: false,
    label: "Label",
  },
  play: focusPlay,
};

export const SizeLargeLayoutStackedErrorTrueStateDisabled: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "large",
    layout: "stacked",
    error: true,
    disabled: true,
    label: "Label",
  },
};

// Independent axis screenshots (single layout baseline)

export const WithLeftDecoration: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: false,
    disabled: false,
    leftDecoration: true,
  },
};

export const WithPrependText: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: false,
    disabled: false,
    prependText: "$",
  },
};

export const WithLeftDecorationAndPrependText: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "single",
    error: false,
    disabled: false,
    leftDecoration: true,
    prependText: "$",
  },
};

// Independent axis screenshots (stacked layout baseline)

export const StackedWithLabel: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: false,
    disabled: false,
    label: "Label",
  },
};

export const StackedWithLeftDecorationAndLabel: Story = {
  render: (args) => <SelectTriggerWrapper {...args} />,
  args: {
    size: "regular",
    layout: "stacked",
    error: false,
    disabled: false,
    leftDecoration: true,
    label: "Label",
  },
};

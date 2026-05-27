import type { Meta, StoryObj } from '@storybook/react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './index';
import { Button } from '../Button';

const meta = {
  title: 'Figma Variants/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-[300px] items-center justify-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideTopOpenStateClosed: Story = {
  render: () => (
    <Tooltip defaultOpen={false}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="top">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const SideTopOpenStateOpen: Story = {
  render: () => (
    <Tooltip defaultOpen={true}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="top">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const SideBottomOpenStateClosed: Story = {
  render: () => (
    <Tooltip defaultOpen={false}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="bottom">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const SideBottomOpenStateOpen: Story = {
  render: () => (
    <Tooltip defaultOpen={true}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="bottom">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const SideLeftOpenStateClosed: Story = {
  render: () => (
    <Tooltip defaultOpen={false}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="left">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const SideLeftOpenStateOpen: Story = {
  render: () => (
    <Tooltip defaultOpen={true}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="left">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const SideRightOpenStateClosed: Story = {
  render: () => (
    <Tooltip defaultOpen={false}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="right">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const SideRightOpenStateOpen: Story = {
  render: () => (
    <Tooltip defaultOpen={true}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="right">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const WithCustomButton: Story = {
  render: () => (
    <Tooltip defaultOpen={true}>
      <TooltipTrigger asChild>
        <Button variant="outline">Button with tooltip</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Tooltip text</TooltipContent>
    </Tooltip>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <Tooltip defaultOpen={true}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent side="top">
        This is a longer tooltip text that provides more detailed information to the user
      </TooltipContent>
    </Tooltip>
  ),
};

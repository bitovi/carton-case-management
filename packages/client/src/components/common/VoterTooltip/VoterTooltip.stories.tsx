import type { Meta, StoryObj } from '@storybook/react';
import { VoterTooltip } from './VoterTooltip';

const meta: Meta<typeof VoterTooltip> = {
  component: VoterTooltip,
  title: 'Components/Common/VoterTooltip',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3311-8265&t=3XuZBnUA9dL2i9Jv-4',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VoterTooltip>;

export const UpVariant: Story = {
  args: {
    type: 'up',
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: <span className="text-sm font-semibold">Alex Morgan</span>,
  },
  name: 'Type: Up',
};

export const DownVariant: Story = {
  args: {
    type: 'down',
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: <span className="text-sm font-semibold">Alex Morgan</span>,
  },
  name: 'Type: Down',
};

export const Default: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: <span className="text-sm font-semibold">Alex Morgan</span>,
  },
  name: 'Default (Type: Up)',
};

export const CustomContent: Story = {
  args: {
    type: 'up',
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: (
      <div className="flex flex-col items-start w-full px-2">
        <span className="text-sm font-semibold">Alex Morgan</span>
        <span className="text-xs text-gray-500">2 hours ago</span>
      </div>
    ),
  },
  name: 'Custom Content',
};

export const MultipleVoters: Story = {
  args: {
    type: 'up',
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
    children: (
      <div className="flex flex-col items-start w-full px-2 gap-1">
        <span className="text-sm font-semibold">Alex Morgan</span>
        <span className="text-sm font-semibold">Jordan Lee</span>
        <span className="text-xs text-gray-500">+3 more</span>
      </div>
    ),
  },
  name: 'Multiple Voters',
};


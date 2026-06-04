import type { Meta, StoryObj } from '@storybook/react';
import { FiltersList } from './FiltersList';
import type { FilterItem } from './types';

const singleSelectOptions = [
  { value: 'option-a', label: 'Option A' },
  { value: 'option-b', label: 'Option B' },
  { value: 'option-c', label: 'Option C' },
];

const multiSelectOptions = [
  { value: 'val-1', label: 'Value 1' },
  { value: 'val-2', label: 'Value 2' },
  { value: 'val-3', label: 'Value 3' },
];

const noop = () => {};

function makeSingleFilter(id: string, label: string, selected: boolean): FilterItem<string> {
  return {
    id,
    label,
    value: selected ? 'option-a' : '',
    options: singleSelectOptions,
    multiSelect: false,
    onChange: noop,
  };
}

function makeMultiFilter(id: string, label: string, selected: boolean): FilterItem<string[]> {
  return {
    id,
    label,
    value: selected ? ['val-1'] : [],
    options: multiSelectOptions,
    multiSelect: true,
    count: selected ? 1 : 0,
    onChange: noop,
  };
}

function buildFilters(
  itemCount: number,
  filterMix: 'single-select-only' | 'multi-select-only' | 'mixed',
  selectionState: 'all-empty' | 'some-selected',
): FilterItem[] {
  const selected = selectionState === 'some-selected';
  const labels = ['Status', 'Customer', 'Priority', 'Last Updated'];
  const filters: FilterItem[] = [];

  for (let i = 0; i < itemCount; i++) {
    const label = labels[i] || `Filter ${i + 1}`;
    const id = `filter-${i}`;

    if (filterMix === 'single-select-only') {
      filters.push(makeSingleFilter(id, label, selected && i === 0));
    } else if (filterMix === 'multi-select-only') {
      filters.push(makeMultiFilter(id, label, selected && i === 0));
    } else {
      if (i % 2 === 0) {
        filters.push(makeSingleFilter(id, label, selected && i === 0));
      } else {
        filters.push(makeMultiFilter(id, label, selected && i === 1));
      }
    }
  }

  return filters;
}

const meta = {
  title: 'Figma Variants/FiltersList',
  component: FiltersList,
  decorators: [],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FiltersList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ItemCount1SingleSelectOnlySomeSelected: Story = {
  args: {
    filters: buildFilters(1, 'single-select-only', 'some-selected'),
  },
};

export const ItemCount1SingleSelectOnlyAllEmpty: Story = {
  args: {
    filters: buildFilters(1, 'single-select-only', 'all-empty'),
  },
};

export const ItemCount1MultiSelectOnlySomeSelected: Story = {
  args: {
    filters: buildFilters(1, 'multi-select-only', 'some-selected'),
  },
};

export const ItemCount1MultiSelectOnlyAllEmpty: Story = {
  args: {
    filters: buildFilters(1, 'multi-select-only', 'all-empty'),
  },
};

export const ItemCount2SingleSelectOnlySomeSelected: Story = {
  args: {
    filters: buildFilters(2, 'single-select-only', 'some-selected'),
  },
};

export const ItemCount2SingleSelectOnlyAllEmpty: Story = {
  args: {
    filters: buildFilters(2, 'single-select-only', 'all-empty'),
  },
};

export const ItemCount2MultiSelectOnlySomeSelected: Story = {
  args: {
    filters: buildFilters(2, 'multi-select-only', 'some-selected'),
  },
};

export const ItemCount2MultiSelectOnlyAllEmpty: Story = {
  args: {
    filters: buildFilters(2, 'multi-select-only', 'all-empty'),
  },
};

export const ItemCount2MixedSomeSelected: Story = {
  args: {
    filters: buildFilters(2, 'mixed', 'some-selected'),
  },
};

export const ItemCount2MixedAllEmpty: Story = {
  args: {
    filters: buildFilters(2, 'mixed', 'all-empty'),
  },
};

export const ItemCount3MixedSomeSelected: Story = {
  args: {
    filters: buildFilters(3, 'mixed', 'some-selected'),
  },
};

export const ItemCount3MixedAllEmpty: Story = {
  args: {
    filters: buildFilters(3, 'mixed', 'all-empty'),
  },
};

export const ItemCount4MixedSomeSelected: Story = {
  args: {
    filters: buildFilters(4, 'mixed', 'some-selected'),
  },
};

export const HasTitleFalse: Story = {
  args: {
    filters: buildFilters(2, 'single-select-only', 'some-selected'),
    title: '',
  },
};

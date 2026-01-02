import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './date-picker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: function Default() {
    const [date, setDate] = useState<Date | undefined>();
    return <DatePicker value={date} onChange={setDate} />;
  },
};

export const WithDefaultValue: Story = {
  render: function WithDefaultValue() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <DatePicker value={date} onChange={setDate} />;
  },
};

export const WithCustomPlaceholder: Story = {
  render: function WithCustomPlaceholder() {
    const [date, setDate] = useState<Date | undefined>();
    return <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />;
  },
};

export const WithLabel: Story = {
  render: function WithLabel() {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="space-y-2">
        <label htmlFor="date-picker" className="text-sm font-medium">
          Select Date
        </label>
        <DatePicker id="date-picker" value={date} onChange={setDate} />
      </div>
    );
  },
};

export const InForm: Story = {
  render: function InForm() {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    return (
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <DatePicker value={startDate} onChange={setStartDate} placeholder="Select start date" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <DatePicker value={endDate} onChange={setEndDate} placeholder="Select end date" />
        </div>
      </div>
    );
  },
};

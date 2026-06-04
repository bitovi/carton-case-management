import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const meta = {
  title: 'Figma Variants/Routes',
  component: Routes,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Routes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RouteMatchedDefault: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-w-[280px] rounded border border-slate-300 bg-white px-6 py-4 text-slate-800">
              Routes matched default path
            </div>
          }
        />
      </Routes>
    </MemoryRouter>
  ),
};
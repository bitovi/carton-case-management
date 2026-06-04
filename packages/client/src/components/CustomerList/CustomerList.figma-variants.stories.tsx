import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { TrpcProvider } from '@/lib/trpc';
import { CustomerList } from './CustomerList';

const mockCustomers = [
  { id: '1', firstName: 'Alice', lastName: 'Johnson' },
  { id: '2', firstName: 'Bob', lastName: 'Smith' },
  { id: '3', firstName: 'Carol', lastName: 'Williams' },
  { id: '4', firstName: 'David', lastName: 'Brown' },
];

const meta = {
  title: 'Figma Variants/CustomerList',
  component: CustomerList,
  decorators: [
    (Story) => (
      <TrpcProvider>
        <Story />
      </TrpcProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    msw: {
      handlers: [
        http.get('/trpc/customer.list', () => {
          return HttpResponse.json({
            result: { data: mockCustomers },
          });
        }),
        http.post('/trpc/customer.list', () => {
          return HttpResponse.json({
            result: { data: mockCustomers },
          });
        }),
      ],
    },
  },
} as Meta<typeof CustomerList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentStateLoading: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/customer.list', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockCustomers } });
        }),
        http.post('/trpc/customer.list', async () => {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 10000));
          return HttpResponse.json({ result: { data: mockCustomers } });
        }),
      ],
    },
  },
};

export const ContentStateError: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/customer.list', () => {
          return HttpResponse.json(
            { error: { message: 'Failed to fetch customers', code: 'INTERNAL_SERVER_ERROR' } },
            { status: 500 },
          );
        }),
        http.post('/trpc/customer.list', () => {
          return HttpResponse.json(
            { error: { message: 'Failed to fetch customers', code: 'INTERNAL_SERVER_ERROR' } },
            { status: 500 },
          );
        }),
      ],
    },
  },
};

export const ContentStateEmpty: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('/trpc/customer.list', () => {
          return HttpResponse.json({ result: { data: [] } });
        }),
        http.post('/trpc/customer.list', () => {
          return HttpResponse.json({ result: { data: [] } });
        }),
      ],
    },
  },
};

export const ContentStateLoadedActiveItemNoneItemHoverFalse: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const ContentStateLoadedActiveItemPresentItemHoverFalse: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/customers/2']}>
        <Routes>
          <Route path="/customers/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export const ContentStateLoadedActiveItemNoneItemHoverTrue: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('a');
    if (items.length > 0) {
      items[0].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (items[0] as HTMLElement).classList.add('hover');
    }
  },
};

export const ContentStateLoadedActiveItemPresentItemHoverTrue: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/customers/2']}>
        <Routes>
          <Route path="/customers/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('a');
    const nonActiveItem = Array.from(items).find(
      (item) => !item.className.includes('bg-[#e8feff]'),
    );
    if (nonActiveItem) {
      nonActiveItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      (nonActiveItem as HTMLElement).classList.add('hover');
    }
  },
};

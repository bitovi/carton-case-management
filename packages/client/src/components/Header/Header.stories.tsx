// type import removed:  Meta, StoryObj  from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const meta = {
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;


export const Desktop = {
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const CustomInitials = {
  args: {
    userInitials: 'JD',
  },
};

export const WithCallback = {
  args: {
    onAvatarClick: () => console.log('Avatar clicked'),
  },
};

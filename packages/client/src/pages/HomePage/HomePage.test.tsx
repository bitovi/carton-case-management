import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTrpc } from '@/test/utils';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders a welcome heading', () => {
    renderWithTrpc(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders a card for each section', () => {
    renderWithTrpc(<HomePage />);

    expect(screen.getByText('Cases')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
  });

  it('links each section to its list route', () => {
    renderWithTrpc(<HomePage />);

    expect(screen.getByLabelText('Go to Cases')).toHaveAttribute('href', '/cases/');
    expect(screen.getByLabelText('Go to Users')).toHaveAttribute('href', '/users/');
    expect(screen.getByLabelText('Go to Customers')).toHaveAttribute('href', '/customers/');
  });
});

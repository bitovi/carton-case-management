import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { MenuList } from './MenuList';
import type { MenuItem } from './types';

describe('MenuList', () => {
  const mockItems: MenuItem[] = [
    { id: 'home', label: 'Home', path: '/', icon: <Home data-testid="home-icon" /> },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: <Settings data-testid="settings-icon" />,
    },
  ];

  it('renders all menu items on desktop (via aria-labels)', () => {
    render(
      <BrowserRouter>
        <MenuList items={mockItems} />
      </BrowserRouter>
    );
    // Desktop view uses aria-labels, not visible text
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders icons for each item', () => {
    render(
      <BrowserRouter>
        <MenuList items={mockItems} />
      </BrowserRouter>
    );
    // Icons appear in both mobile button and desktop links
    expect(screen.getAllByTestId('home-icon').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('settings-icon').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onItemClick callback when desktop item is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MenuList items={mockItems} onItemClick={handleClick} />
      </BrowserRouter>
    );

    // Click the desktop link (by aria-label)
    const homeLink = screen.getByRole('link', { name: 'Home' });
    await user.click(homeLink);
    expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('marks active item with aria-current on desktop', () => {
    const itemsWithActive = mockItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    }));

    render(
      <BrowserRouter>
        <MenuList items={itemsWithActive} />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders with semantic nav element', () => {
    render(
      <BrowserRouter>
        <MenuList items={mockItems} />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main menu');
  });

  it('handles empty items array', () => {
    render(
      <BrowserRouter>
        <MenuList items={[]} />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});

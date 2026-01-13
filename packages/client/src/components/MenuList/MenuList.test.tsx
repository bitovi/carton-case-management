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

  it('renders all menu items in both mobile and desktop views', () => {
    render(
      <BrowserRouter>
        <MenuList items={mockItems} />
      </BrowserRouter>
    );
    // Items render in both mobile (with visible text) and desktop (with aria-label)
    // So we expect 2 links per item (mobile + desktop)
    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    const settingsLinks = screen.getAllByRole('link', { name: 'Settings' });
    expect(homeLinks).toHaveLength(2);
    expect(settingsLinks).toHaveLength(2);
  });

  it('renders icons for each item', () => {
    render(
      <BrowserRouter>
        <MenuList items={mockItems} />
      </BrowserRouter>
    );
    // Icons appear in both mobile and desktop views
    expect(screen.getAllByTestId('home-icon')).toHaveLength(2);
    expect(screen.getAllByTestId('settings-icon')).toHaveLength(2);
  });

  it('calls onItemClick callback when item is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MenuList items={mockItems} onItemClick={handleClick} />
      </BrowserRouter>
    );

    // Click the first home link (mobile view)
    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    await user.click(homeLinks[0]);
    expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('marks active item with aria-current in both views', () => {
    const itemsWithActive = mockItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    }));

    render(
      <BrowserRouter>
        <MenuList items={itemsWithActive} />
      </BrowserRouter>
    );

    // Both mobile and desktop Home links should have aria-current
    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    homeLinks.forEach((link) => {
      expect(link).toHaveAttribute('aria-current', 'page');
    });
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

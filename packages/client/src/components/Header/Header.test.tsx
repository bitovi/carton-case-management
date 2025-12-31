import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

describe('Header', () => {
  it('renders logo and application name', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/navigate to home/i)).toBeInTheDocument();
    expect(screen.getByText(/carton/i)).toBeInTheDocument();
  });

  it('renders user initials in avatar', () => {
    render(
      <BrowserRouter>
        <Header userInitials="JD" />
      </BrowserRouter>
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('logo Link has correct path and ARIA label', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const logoLink = screen.getByLabelText(/navigate to home/i);
    expect(logoLink).toHaveAttribute('href', '/');
    expect(logoLink).toHaveAttribute('aria-label', 'Navigate to home');
  });

  it('renders with default initials when not provided', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('AM')).toBeInTheDocument();
  });

  it('dropdown has correct ARIA attributes', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const avatar = screen.getByLabelText(/user menu/i);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('aria-label', 'User menu');
  });

  it('calls onAvatarClick callback when provided', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Header onAvatarClick={handleClick} />
      </BrowserRouter>
    );

    const avatar = screen.getByLabelText(/user menu/i);
    await user.click(avatar);

    expect(handleClick).toHaveBeenCalled();
  });
});

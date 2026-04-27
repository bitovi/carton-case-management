import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouterWrapper } from '../../test/utils';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './HomePage';

function renderHomePage() {
  const Wrapper = createMemoryRouterWrapper(['/']);
  return render(
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cases/" element={<div data-testid="cases-page" />} />
      <Route path="/customers/" element={<div data-testid="customers-page" />} />
      <Route path="/users/" element={<div data-testid="users-page" />} />
    </Routes>,
    { wrapper: Wrapper }
  );
}

describe('HomePage', () => {
  it('renders the Carton brand name', () => {
    renderHomePage();
    expect(screen.getByText('Carton')).toBeInTheDocument();
  });

  it('renders the hero tagline', () => {
    renderHomePage();
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText('Carton')).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    renderHomePage();
    expect(screen.getByText('Case Management')).toBeInTheDocument();
    expect(screen.getByText('Customer Profiles')).toBeInTheDocument();
    expect(screen.getByText('Team Collaboration')).toBeInTheDocument();
  });

  it('navigates to /cases/ when Open Cases is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();
    await user.click(screen.getByRole('button', { name: /Open Cases/i }));
    expect(screen.getByTestId('cases-page')).toBeInTheDocument();
  });

  it('navigates to /customers/ when View Customers is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();
    await user.click(screen.getByRole('button', { name: /View Customers/i }));
    expect(screen.getByTestId('customers-page')).toBeInTheDocument();
  });

  it('navigates to /cases/ when Case Management card is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();
    await user.click(screen.getByRole('button', { name: /Case Management/i }));
    expect(screen.getByTestId('cases-page')).toBeInTheDocument();
  });

  it('navigates to /customers/ when Customer Profiles card is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();
    await user.click(screen.getByRole('button', { name: /Customer Profiles/i }));
    expect(screen.getByTestId('customers-page')).toBeInTheDocument();
  });

  it('navigates to /users/ when Team Collaboration card is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();
    await user.click(screen.getByRole('button', { name: /Team Collaboration/i }));
    expect(screen.getByTestId('users-page')).toBeInTheDocument();
  });

  it('renders a footer with copyright', () => {
    renderHomePage();
    expect(screen.getByText(/Carton — Case Management Platform/i)).toBeInTheDocument();
  });
});

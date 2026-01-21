import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

describe('Card', () => {
  describe('Card (container)', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('has correct base styles', () => {
      render(<Card>Content</Card>);
      const card = screen.getByText('Content').closest('[data-slot="card"]');
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'shadow-sm');
    });

    it('applies custom className', () => {
      render(<Card className="w-96">Content</Card>);
      const card = screen.getByText('Content').closest('[data-slot="card"]');
      expect(card).toHaveClass('w-96');
    });

    it('forwards ref', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Card ref={ref}>Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('passes through HTML attributes', () => {
      render(<Card data-testid="custom-card">Content</Card>);
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('renders children', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('has correct spacing styles', () => {
      render(<CardHeader>Content</CardHeader>);
      const header = screen.getByText('Content').closest('[data-slot="card-header"]');
      expect(header).toHaveClass('flex', 'flex-col', 'gap-1', 'p-6');
    });

    it('applies custom className', () => {
      render(<CardHeader className="pb-4">Content</CardHeader>);
      const header = screen.getByText('Content').closest('[data-slot="card-header"]');
      expect(header).toHaveClass('pb-4');
    });
  });

  describe('CardTitle', () => {
    it('renders children', () => {
      render(<CardTitle>Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders as h3 by default', () => {
      render(<CardTitle>Title</CardTitle>);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title');
    });

    it('has correct typography styles', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('text-base', 'font-semibold');
    });

    it('applies custom className', () => {
      render(<CardTitle className="text-xl">Title</CardTitle>);
      expect(screen.getByText('Title')).toHaveClass('text-xl');
    });
  });

  describe('CardDescription', () => {
    it('renders children', () => {
      render(<CardDescription>Description text</CardDescription>);
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('has muted text styles', () => {
      render(<CardDescription>Description</CardDescription>);
      const desc = screen.getByText('Description');
      expect(desc).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('applies custom className', () => {
      render(<CardDescription className="mt-2">Description</CardDescription>);
      expect(screen.getByText('Description')).toHaveClass('mt-2');
    });
  });

  describe('CardContent', () => {
    it('renders children', () => {
      render(<CardContent>Main content</CardContent>);
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('has correct padding styles', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content').closest('[data-slot="card-content"]');
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardContent className="p-0">Content</CardContent>);
      const content = screen.getByText('Content').closest('[data-slot="card-content"]');
      expect(content).toHaveClass('p-0');
    });
  });

  describe('CardFooter', () => {
    it('renders children', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('has flex layout styles', () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText('Footer').closest('[data-slot="card-footer"]');
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardFooter className="justify-between">Footer</CardFooter>);
      const footer = screen.getByText('Footer').closest('[data-slot="card-footer"]');
      expect(footer).toHaveClass('justify-between');
    });
  });

  describe('Compound usage', () => {
    it('renders simple card (1 slot equivalent)', () => {
      render(
        <Card>
          <CardContent>Simple content</CardContent>
        </Card>
      );
      expect(screen.getByText('Simple content')).toBeInTheDocument();
    });

    it('renders card with header (2 slots equivalent)', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Contact us</CardTitle>
            <CardDescription>
              Contact us and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>Form fields here</CardContent>
        </Card>
      );

      expect(screen.getByRole('heading', { name: 'Contact us' })).toBeInTheDocument();
      expect(screen.getByText("Contact us and we'll get back to you.")).toBeInTheDocument();
      expect(screen.getByText('Form fields here')).toBeInTheDocument();
    });

    it('renders full card with footer (3 slots equivalent)', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email</CardDescription>
          </CardHeader>
          <CardContent>
            <input placeholder="Email" />
          </CardContent>
          <CardFooter>
            <button>Sign in</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('CardTitle has heading role', () => {
      render(<CardTitle>Accessible Title</CardTitle>);
      expect(screen.getByRole('heading', { name: 'Accessible Title' })).toBeInTheDocument();
    });

    it('supports aria attributes', () => {
      render(
        <Card role="article" aria-label="User profile card">
          <CardContent>Profile info</CardContent>
        </Card>
      );
      expect(screen.getByRole('article', { name: 'User profile card' })).toBeInTheDocument();
    });
  });
});

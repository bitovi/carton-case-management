import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from './Popover';

describe('Popover', () => {
  describe('Rendering', () => {
    it('renders the trigger', () => {
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      expect(screen.getByText('Open Popover')).toBeInTheDocument();
    });

    it('does not render content by default', () => {
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders content when defaultOpen is true', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens popover on trigger click', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });

    it('closes popover when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <Popover>
            <PopoverTrigger>Open Popover</PopoverTrigger>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </div>
      );

      await user.click(screen.getByText('Open Popover'));
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      });
    });

    it('closes popover with Escape key', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      });
    });

    it('closes popover when PopoverClose is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>
            <p>Content</p>
            <PopoverClose data-testid="close-btn">Close</PopoverClose>
          </PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('close-btn'));

      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Controlled', () => {
    it('respects controlled open state', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Popover onOpenChange={onOpenChange}>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Positioning', () => {
    it('renders with default alignment (center)', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent data-testid="content">Content</PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
      });
    });

    it('renders with align="start"', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent align="start" data-testid="content">
            Content
          </PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-align', 'start');
      });
    });

    it('renders with align="end"', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent align="end" data-testid="content">
            Content
          </PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-align', 'end');
      });
    });
  });

  describe('Custom className', () => {
    it('applies custom className to content', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent className="custom-class" data-testid="content">
            Content
          </PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveClass('custom-class');
      });
    });
  });

  describe('asChild', () => {
    it('works with asChild on trigger', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button>Custom Button</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      const button = screen.getByText('Custom Button');
      expect(button.tagName).toBe('BUTTON');

      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });
});

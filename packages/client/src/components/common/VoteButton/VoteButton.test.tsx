import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoteButton } from './VoteButton';

describe('VoteButton', () => {
  describe('Type prop', () => {
    it('renders thumbs up icon when type="up"', () => {
      render(<VoteButton type="up" />);
      expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    });

    it('renders thumbs down icon when type="down"', () => {
      render(<VoteButton type="down" />);
      expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
    });
  });

  describe('Active state', () => {
    it('applies teal color when type="up" and active=true', () => {
      render(<VoteButton type="up" active={true} />);
      const button = screen.getByLabelText('Upvote');
      expect(button).toHaveClass('text-teal-500');
    });

    it('applies red color when type="down" and active=true', () => {
      render(<VoteButton type="down" active={true} />);
      const button = screen.getByLabelText('Downvote');
      expect(button).toHaveClass('text-red-500');
    });

    it('applies gray color when active=false', () => {
      render(<VoteButton type="up" active={false} />);
      const button = screen.getByLabelText('Upvote');
      expect(button).toHaveClass('text-slate-700');
    });

    it('sets aria-pressed=true when active', () => {
      render(<VoteButton type="up" active={true} />);
      const button = screen.getByLabelText('Upvote');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('sets aria-pressed=false when not active', () => {
      render(<VoteButton type="up" active={false} />);
      const button = screen.getByLabelText('Upvote');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Count display', () => {
    it('displays count when showCount=true and count is provided', () => {
      render(<VoteButton type="up" showCount={true} count={42} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('hides count when showCount=false', () => {
      render(<VoteButton type="up" showCount={false} count={42} />);
      expect(screen.queryByText('42')).not.toBeInTheDocument();
    });

    it('does not display count when count is undefined', () => {
      render(<VoteButton type="up" showCount={true} />);
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });

    it('displays count of 0', () => {
      render(<VoteButton type="up" showCount={true} count={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles large count numbers', () => {
      render(<VoteButton type="up" showCount={true} count={9999} />);
      expect(screen.getByText('9999')).toBeInTheDocument();
    });
  });

  describe('Click interaction', () => {
    it('calls onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<VoteButton type="up" onClick={handleClick} />);
      
      await user.click(screen.getByLabelText('Upvote'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when onClick is not provided', async () => {
      const user = userEvent.setup();
      render(<VoteButton type="up" />);
      
      await user.click(screen.getByLabelText('Upvote'));
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<VoteButton type="up" className="custom-class" />);
      const button = screen.getByLabelText('Upvote');
      expect(button).toHaveClass('custom-class');
    });

    it('maintains base classes with custom className', () => {
      render(<VoteButton type="up" className="custom-class" />);
      const button = screen.getByLabelText('Upvote');
      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('is a button element', () => {
      render(<VoteButton type="up" />);
      const button = screen.getByLabelText('Upvote');
      expect(button.tagName).toBe('BUTTON');
    });

    it('has type="button"', () => {
      render(<VoteButton type="up" />);
      const button = screen.getByLabelText('Upvote');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('has appropriate aria-label for upvote', () => {
      render(<VoteButton type="up" />);
      expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    });

    it('has appropriate aria-label for downvote', () => {
      render(<VoteButton type="down" />);
      expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
    });
  });

  describe('Voters tooltip', () => {
    it('shows voter names when voters array is provided with count', async () => {
      const user = userEvent.setup();
      render(
        <VoteButton 
          type="up" 
          count={3} 
          voters={['Alice', 'Bob', 'Charlie']} 
        />
      );
      
      await user.hover(screen.getByLabelText('Upvote'));
      
      // Wait for tooltip to appear
      expect(await screen.findByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('truncates voters after 3 and shows +X more', async () => {
      const user = userEvent.setup();
      render(
        <VoteButton 
          type="up" 
          count={5} 
          voters={['Alice', 'Bob', 'Charlie', 'David', 'Eve']} 
        />
      );
      
      await user.hover(screen.getByLabelText('Upvote'));
      
      expect(await screen.findByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('+2 more')).toBeInTheDocument();
      expect(screen.queryByText('David')).not.toBeInTheDocument();
      expect(screen.queryByText('Eve')).not.toBeInTheDocument();
    });

    it('does not show tooltip when voters array is empty', () => {
      render(<VoteButton type="up" count={0} voters={[]} />);
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    it('does not show tooltip when voters is undefined', () => {
      render(<VoteButton type="up" count={3} />);
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    it('does not show tooltip when count is 0', () => {
      render(<VoteButton type="up" count={0} voters={['Alice']} />);
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    it('applies correct color to tooltip based on vote type', async () => {
      const user = userEvent.setup();
      render(
        <VoteButton 
          type="down" 
          count={2} 
          voters={['Alice', 'Bob']} 
        />
      );
      
      await user.hover(screen.getByLabelText('Downvote'));
      
      const tooltip = await screen.findByText('Alice');
      const tooltipContainer = tooltip.closest('div');
      expect(tooltipContainer?.parentElement).toHaveClass('text-red-500');
    });
  });
});


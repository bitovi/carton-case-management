import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactionStatistics } from './ReactionStatistics';

describe('ReactionStatistics', () => {
  describe('Rendering', () => {
    it('renders both vote buttons', () => {
      render(<ReactionStatistics />);
      expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
      expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
    });

    it('renders with userVote="none"', () => {
      render(<ReactionStatistics userVote="none" />);
      expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
      expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
    });

    it('renders with userVote="up"', () => {
      render(<ReactionStatistics userVote="up" upvotes={5} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders with userVote="down"', () => {
      render(<ReactionStatistics userVote="down" downvotes={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('UserVote variant behavior', () => {
    it('shows counts when votes exist even when userVote="none"', () => {
      render(<ReactionStatistics userVote="none" upvotes={5} downvotes={3} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows no counts when no votes exist', () => {
      render(<ReactionStatistics userVote="none" upvotes={0} downvotes={0} />);
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('shows both counts when userVote="up" and both have votes', () => {
      render(<ReactionStatistics userVote="up" upvotes={5} downvotes={3} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows both counts when userVote="down" and both have votes', () => {
      render(<ReactionStatistics userVote="down" upvotes={5} downvotes={3} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('makes upvote button active when userVote="up"', () => {
      render(<ReactionStatistics userVote="up" />);
      const upvoteButton = screen.getByLabelText('Upvote');
      expect(upvoteButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('makes downvote button active when userVote="down"', () => {
      render(<ReactionStatistics userVote="down" />);
      const downvoteButton = screen.getByLabelText('Downvote');
      expect(downvoteButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Click handlers', () => {
    it('calls onUpvote when upvote button is clicked', async () => {
      const user = userEvent.setup();
      const handleUpvote = vi.fn();
      render(<ReactionStatistics onUpvote={handleUpvote} />);
      
      await user.click(screen.getByLabelText('Upvote'));
      expect(handleUpvote).toHaveBeenCalledTimes(1);
    });

    it('calls onDownvote when downvote button is clicked', async () => {
      const user = userEvent.setup();
      const handleDownvote = vi.fn();
      render(<ReactionStatistics onDownvote={handleDownvote} />);
      
      await user.click(screen.getByLabelText('Downvote'));
      expect(handleDownvote).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClick handlers are not provided', async () => {
      const user = userEvent.setup();
      render(<ReactionStatistics />);
      
      await user.click(screen.getByLabelText('Upvote'));
      await user.click(screen.getByLabelText('Downvote'));
      // Should not throw
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<ReactionStatistics className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('maintains base classes with custom className', () => {
      const { container } = render(<ReactionStatistics className="custom-class" />);
      expect(container.firstChild).toHaveClass('inline-flex');
      expect(container.firstChild).toHaveClass('items-center');
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Default prop values', () => {
    it('defaults userVote to "none"', () => {
      render(<ReactionStatistics upvotes={5} downvotes={3} />);
      // With new behavior, counts show when votes exist even if userVote="none"
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('defaults upvotes and downvotes to 0', () => {
      render(<ReactionStatistics userVote="up" />);
      // No counts should show when default is 0
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });
});

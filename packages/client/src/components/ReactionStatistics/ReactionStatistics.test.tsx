import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactionStatistics } from './ReactionStatistics';

describe('ReactionStatistics', () => {
  // Figma Variant: State=Rest
  describe('Rest state - no reactions exist yet', () => {
    // Figma Variant: State=Rest
    it('renders thumbs-up icon without count', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} />);
      
      const upvoteIcon = screen.getByLabelText(/thumbs up/i);
      expect(upvoteIcon).toBeInTheDocument();
      
      // No count should be displayed
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    // Figma Variant: State=Rest
    it('renders thumbs-down icon without count', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} />);
      
      const downvoteIcon = screen.getByLabelText(/thumbs down/i);
      expect(downvoteIcon).toBeInTheDocument();
    });

    // Figma Variant: State=Rest
    it('has correct spacing between icons (gap-md = 16px)', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} />);
      
      const container = screen.getByTestId('reaction-statistics');
      expect(container).toHaveClass('gap-4'); // Tailwind gap-4 = 16px = var(--spacing/md)
    });

    // Figma Variant: State=Rest
    it('has correct padding (py-1 = 4px)', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} />);
      
      const container = screen.getByTestId('reaction-statistics');
      expect(container).toHaveClass('py-1'); // Tailwind py-1 = 4px = var(--spacing/xs)
    });

    // Figma Variant: State=Rest
    it('has rounded corners (rounded-lg = 8px)', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} />);
      
      const container = screen.getByTestId('reaction-statistics');
      expect(container).toHaveClass('rounded-lg'); // 8px = var(--semantic/rounded-lg)
    });

    // Figma Variant: State=Rest
    it('icons have correct default color (gray-800 = #334041)', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} />);
      
      const upvoteIcon = screen.getByLabelText(/thumbs up/i);
      const downvoteIcon = screen.getByLabelText(/thumbs down/i);
      
      expect(upvoteIcon).toHaveClass('text-gray-800');
      expect(downvoteIcon).toHaveClass('text-gray-800');
    });
  });

  // Figma Variant: State=Count
  describe('Count state - reactions exist with counts', () => {
    // Figma Variant: State=Count
    it('renders upvote icon with count number', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} hasUserUpvoted={false} hasUserDownvoted={false} />);
      
      expect(screen.getByLabelText(/thumbs up/i)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    // Figma Variant: State=Count
    it('renders downvote icon with count number', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} hasUserUpvoted={false} hasUserDownvoted={false} />);
      
      expect(screen.getByLabelText(/thumbs down/i)).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Figma Variant: State=Count
    it('has correct gap between icon and count (gap-sm = 8px)', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} hasUserUpvoted={false} hasUserDownvoted={false} />);
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      expect(upvoteGroup).toHaveClass('gap-2'); // Tailwind gap-2 = 8px = var(--spacing/sm)
    });

    // Figma Variant: State=Count
    it('has correct gap between reactions (gap-md = 16px)', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} hasUserUpvoted={false} hasUserDownvoted={false} />);
      
      const container = screen.getByTestId('reaction-statistics');
      expect(container).toHaveClass('gap-4'); // Tailwind gap-4 = 16px = var(--spacing/md)
    });

    // Figma Variant: State=Count
    it('count text has correct font size (14px)', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} hasUserUpvoted={false} hasUserDownvoted={false} />);
      
      const upvoteCount = screen.getByText('5');
      expect(upvoteCount).toHaveClass('text-sm'); // 14px
    });

    // Figma Variant: State=Count
    it('count text has correct color (gray-950 = #192627)', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} hasUserUpvoted={false} hasUserDownvoted={false} />);
      
      const upvoteCount = screen.getByText('5');
      const downvoteCount = screen.getByText('2');
      
      expect(upvoteCount).toHaveClass('text-gray-950');
      expect(downvoteCount).toHaveClass('text-gray-950');
    });

    // Figma Variant: State=Count
    it('count text has correct line height (leading-[21px])', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} hasUserUpvoted={false} hasUserDownvoted={false} />);
      
      const upvoteCount = screen.getByText('5');
      expect(upvoteCount).toHaveClass('leading-[21px]');
    });
  });

  // Figma Variant: State=Selected
  describe('Selected state - user has upvoted', () => {
    // Figma Variant: State=Selected
    it('upvote icon changes to teal color when user has upvoted (teal-500 = #01a6ae)', () => {
      render(<ReactionStatistics upvoteCount={1} downvoteCount={0} hasUserUpvoted={true} hasUserDownvoted={false} />);
      
      const upvoteIcon = screen.getByLabelText(/thumbs up/i);
      expect(upvoteIcon).toHaveClass('text-teal-500');
    });

    // Figma Variant: State=Selected
    it('upvote count changes to teal color when user has upvoted', () => {
      render(<ReactionStatistics upvoteCount={1} downvoteCount={0} hasUserUpvoted={true} hasUserDownvoted={false} />);
      
      const upvoteCount = screen.getByText('1');
      expect(upvoteCount).toHaveClass('text-teal-500');
    });

    // Figma Variant: State=Selected
    it('downvote icon stays default color when user upvoted', () => {
      render(<ReactionStatistics upvoteCount={1} downvoteCount={0} hasUserUpvoted={true} hasUserDownvoted={false} />);
      
      const downvoteIcon = screen.getByLabelText(/thumbs down/i);
      expect(downvoteIcon).toHaveClass('text-gray-800');
    });

    // Figma Variant: State=Selected
    it('downvote icon changes to teal color when user has downvoted', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={1} hasUserUpvoted={false} hasUserDownvoted={true} />);
      
      const downvoteIcon = screen.getByLabelText(/thumbs down/i);
      expect(downvoteIcon).toHaveClass('text-teal-500');
    });

    // Figma Variant: State=Selected
    it('downvote count changes to teal color when user has downvoted', () => {
      render(<ReactionStatistics upvoteCount={0} downvoteCount={1} hasUserUpvoted={false} hasUserDownvoted={true} />);
      
      const downvoteCount = screen.getByText('1');
      expect(downvoteCount).toHaveClass('text-teal-500');
    });
  });

  // Figma Variant: State=Hover
  describe('Hover state - tooltip with user list', () => {
    // Figma Variant: State=Hover
    it('shows tooltip with upvoter names when hovering upvote section', async () => {
      const upvoters = ['Alex Morgan', 'Greg Miller', 'Andrew Smith'];
      render(
        <ReactionStatistics 
          upvoteCount={3} 
          downvoteCount={0} 
          hasUserUpvoted={false} 
          hasUserDownvoted={false}
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
      expect(screen.getByText('Greg Miller')).toBeInTheDocument();
      expect(screen.getByText('Andrew Smith')).toBeInTheDocument();
    });

    // Figma Variant: State=Hover
    it('tooltip has correct background color (white)', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const tooltip = screen.getByTestId('upvote-tooltip');
      expect(tooltip).toHaveClass('bg-white');
    });

    // Figma Variant: State=Hover
    it('tooltip has correct border color (border-gray-200 = #e2e8f0)', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const tooltip = screen.getByTestId('upvote-tooltip');
      expect(tooltip).toHaveClass('border');
      expect(tooltip).toHaveClass('border-gray-200');
    });

    // Figma Variant: State=Hover
    it('tooltip has correct shadow (shadow-md)', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const tooltip = screen.getByTestId('upvote-tooltip');
      expect(tooltip).toHaveClass('shadow-md');
    });

    // Figma Variant: State=Hover
    it('tooltip has correct width (w-[200px])', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const tooltip = screen.getByTestId('upvote-tooltip');
      expect(tooltip).toHaveClass('w-[200px]');
    });

    // Figma Variant: State=Hover
    it('tooltip has correct padding (p-2 = 8px)', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const tooltip = screen.getByTestId('upvote-tooltip');
      expect(tooltip).toHaveClass('p-2'); // 8px = var(--semantic/xs)
    });

    // Figma Variant: State=Hover
    it('tooltip has correct rounded corners (rounded-lg = 8px)', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const tooltip = screen.getByTestId('upvote-tooltip');
      expect(tooltip).toHaveClass('rounded-lg');
    });

    // Figma Variant: State=Hover
    it('user names in tooltip have correct color (teal-600 = #00848b)', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const userName = screen.getByText('Alex Morgan');
      expect(userName).toHaveClass('text-teal-600');
    });

    // Figma Variant: State=Hover
    it('user names in tooltip have correct font weight (font-semibold)', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      const userName = screen.getByText('Alex Morgan');
      expect(userName).toHaveClass('font-semibold');
    });

    // Figma Variant: State=Hover
    it('hides tooltip when mouse leaves upvote section', async () => {
      const upvoters = ['Alex Morgan'];
      render(
        <ReactionStatistics 
          upvoteCount={1} 
          downvoteCount={0} 
          upvoters={upvoters}
        />
      );
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      await userEvent.hover(upvoteGroup);
      
      expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
      
      await userEvent.unhover(upvoteGroup);
      
      expect(screen.queryByText('Alex Morgan')).not.toBeInTheDocument();
    });

    // Figma Variant: State=Hover
    it('shows tooltip with downvoter names when hovering downvote section', async () => {
      const downvoters = ['John Doe'];
      render(
        <ReactionStatistics 
          upvoteCount={0} 
          downvoteCount={1} 
          hasUserUpvoted={false} 
          hasUserDownvoted={false}
          downvoters={downvoters}
        />
      );
      
      const downvoteGroup = screen.getByTestId('downvote-group');
      await userEvent.hover(downvoteGroup);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  // Structural tests (apply to all variants)
  describe('Element ordering', () => {
    // Figma Variant: applies to all states
    it('upvote icon and count always appears before downvote', () => {
      const { container } = render(<ReactionStatistics upvoteCount={5} downvoteCount={2} />);
      
      const elements = container.querySelectorAll('[data-testid^="upvote-"], [data-testid^="downvote-"]');
      const upvoteIndex = Array.from(elements).findIndex(el => el.getAttribute('data-testid')?.includes('upvote'));
      const downvoteIndex = Array.from(elements).findIndex(el => el.getAttribute('data-testid')?.includes('downvote'));
      
      expect(upvoteIndex).toBeLessThan(downvoteIndex);
    });

    // Figma Variant: State=Count
    it('icon always appears before count text within each reaction group', () => {
      render(<ReactionStatistics upvoteCount={5} downvoteCount={2} />);
      
      const upvoteGroup = screen.getByTestId('upvote-group');
      
      // Get all children of the upvote group
      const children = Array.from(upvoteGroup.children);
      
      // Find the icon (svg element) and count (span element)
      const iconIndex = children.findIndex(child => child.tagName === 'svg');
      const countIndex = children.findIndex(child => child.tagName === 'SPAN');
      
      // Icon should come before count in DOM order
      expect(iconIndex).toBeGreaterThanOrEqual(0);
      expect(countIndex).toBeGreaterThanOrEqual(0);
      expect(iconIndex).toBeLessThan(countIndex);
    });
  });

  // Interactive behavior tests
  describe('User interactions', () => {
    // Figma Variant: applies to all states
    it('calls onUpvote when upvote icon is clicked', async () => {
      const onUpvote = vi.fn();
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} onUpvote={onUpvote} />);
      
      const upvoteIcon = screen.getByLabelText(/thumbs up/i);
      await userEvent.click(upvoteIcon);
      
      expect(onUpvote).toHaveBeenCalledTimes(1);
    });

    // Figma Variant: applies to all states
    it('calls onDownvote when downvote icon is clicked', async () => {
      const onDownvote = vi.fn();
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} onDownvote={onDownvote} />);
      
      const downvoteIcon = screen.getByLabelText(/thumbs down/i);
      await userEvent.click(downvoteIcon);
      
      expect(onDownvote).toHaveBeenCalledTimes(1);
    });

    // Figma Variant: State=Selected
    it('calls onUpvote to remove upvote when clicking already-upvoted icon', async () => {
      const onUpvote = vi.fn();
      render(<ReactionStatistics upvoteCount={1} downvoteCount={0} hasUserUpvoted={true} onUpvote={onUpvote} />);
      
      const upvoteIcon = screen.getByLabelText(/thumbs up/i);
      await userEvent.click(upvoteIcon);
      
      expect(onUpvote).toHaveBeenCalledTimes(1);
    });

    // Figma Variant: State=Selected
    it('calls onDownvote to remove downvote when clicking already-downvoted icon', async () => {
      const onDownvote = vi.fn();
      render(<ReactionStatistics upvoteCount={0} downvoteCount={1} hasUserDownvoted={true} onDownvote={onDownvote} />);
      
      const downvoteIcon = screen.getByLabelText(/thumbs down/i);
      await userEvent.click(downvoteIcon);
      
      expect(onDownvote).toHaveBeenCalledTimes(1);
    });

    // Figma Variant: applies to all states
    it('has pointer cursor on upvote icon when interactive', () => {
      const onUpvote = vi.fn();
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} onUpvote={onUpvote} />);
      
      const upvoteIcon = screen.getByLabelText(/thumbs up/i);
      expect(upvoteIcon).toHaveClass('cursor-pointer');
    });

    // Figma Variant: applies to all states
    it('has pointer cursor on downvote icon when interactive', () => {
      const onDownvote = vi.fn();
      render(<ReactionStatistics upvoteCount={0} downvoteCount={0} onDownvote={onDownvote} />);
      
      const downvoteIcon = screen.getByLabelText(/thumbs down/i);
      expect(downvoteIcon).toHaveClass('cursor-pointer');
    });
  });
});

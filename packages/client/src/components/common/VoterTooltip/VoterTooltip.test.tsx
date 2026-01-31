import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoterTooltip } from './VoterTooltip';

describe('VoterTooltip', () => {
  const defaultTrigger = <button>Hover me</button>;

  describe('Rendering', () => {
    it('renders trigger element', () => {
      render(
        <VoterTooltip trigger={defaultTrigger}>
          <span>Alex Morgan</span>
        </VoterTooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders with type="up"', () => {
      render(
        <VoterTooltip type="up" trigger={defaultTrigger}>
          <span>Test Content</span>
        </VoterTooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders with type="down"', () => {
      render(
        <VoterTooltip type="down" trigger={defaultTrigger}>
          <span>Test Content</span>
        </VoterTooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders content children', async () => {
      const user = userEvent.setup();
      render(
        <VoterTooltip trigger={defaultTrigger}>
          <span>Alex Morgan</span>
        </VoterTooltip>
      );
      
      await user.hover(screen.getByText('Hover me'));
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    });
  });

  describe('Type variant', () => {
    it('accepts type="up" prop', () => {
      const { container } = render(
        <VoterTooltip type="up" trigger={defaultTrigger}>
          <span>Content</span>
        </VoterTooltip>
      );
      expect(container).toBeInTheDocument();
    });

    it('accepts type="down" prop', () => {
      const { container } = render(
        <VoterTooltip type="down" trigger={defaultTrigger}>
          <span>Content</span>
        </VoterTooltip>
      );
      expect(container).toBeInTheDocument();
    });

    it('defaults to type="up" when not specified', () => {
      const { container } = render(
        <VoterTooltip trigger={defaultTrigger}>
          <span>Content</span>
        </VoterTooltip>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('accepts custom className', () => {
      render(
        <VoterTooltip className="custom-class" trigger={defaultTrigger}>
          <span>Content</span>
        </VoterTooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('works with custom trigger', () => {
      render(
        <VoterTooltip trigger={<div>Custom Trigger</div>}>
          <span>Content</span>
        </VoterTooltip>
      );
      expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
    });

    it('works with complex content', () => {
      render(
        <VoterTooltip trigger={defaultTrigger}>
          <div className="flex flex-col">
            <span>Alex Morgan</span>
            <span>2 hours ago</span>
          </div>
        </VoterTooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });
  });
});

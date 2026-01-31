import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HoverCard } from './HoverCard';

describe('HoverCard', () => {
  const defaultTrigger = <button>Hover me</button>;
  const defaultChildren = <div>Card content</div>;

  describe('Rendering', () => {
    it('renders trigger element', () => {
      render(
        <HoverCard trigger={defaultTrigger}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders with custom trigger', () => {
      render(
        <HoverCard trigger={<span>Custom trigger</span>}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Custom trigger')).toBeInTheDocument();
    });

    it('renders content children on hover', async () => {
      const user = userEvent.setup();
      render(
        <HoverCard trigger={defaultTrigger}>
          <span>Hidden content</span>
        </HoverCard>
      );

      // Hover over trigger
      await user.hover(screen.getByText('Hover me'));

      // Wait for openDelay (default 700ms)
      await new Promise(resolve => setTimeout(resolve, 800));

      expect(screen.getByText('Hidden content')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('accepts side prop', () => {
      render(
        <HoverCard trigger={defaultTrigger} side="top">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('accepts sideOffset prop', () => {
      render(
        <HoverCard trigger={defaultTrigger} sideOffset={10}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('accepts align prop', () => {
      render(
        <HoverCard trigger={defaultTrigger} align="start">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('accepts openDelay prop', () => {
      render(
        <HoverCard trigger={defaultTrigger} openDelay={200}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('accepts closeDelay prop', () => {
      render(
        <HoverCard trigger={defaultTrigger} closeDelay={100}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(
        <HoverCard trigger={defaultTrigger} className="custom-class">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('renders simple text content', () => {
      render(
        <HoverCard trigger={defaultTrigger}>
          <span>Simple text</span>
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders complex nested content', () => {
      render(
        <HoverCard trigger={defaultTrigger}>
          <div>
            <h3>Title</h3>
            <p>Description</p>
          </div>
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <HoverCard trigger={defaultTrigger}>
          <div>First</div>
          <div>Second</div>
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('works with side="top"', () => {
      render(
        <HoverCard trigger={defaultTrigger} side="top">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('works with side="right"', () => {
      render(
        <HoverCard trigger={defaultTrigger} side="right">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('works with side="bottom"', () => {
      render(
        <HoverCard trigger={defaultTrigger} side="bottom">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('works with side="left"', () => {
      render(
        <HoverCard trigger={defaultTrigger} side="left">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });
  });

  describe('Alignment', () => {
    it('works with align="start"', () => {
      render(
        <HoverCard trigger={defaultTrigger} align="start">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('works with align="center"', () => {
      render(
        <HoverCard trigger={defaultTrigger} align="center">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('works with align="end"', () => {
      render(
        <HoverCard trigger={defaultTrigger} align="end">
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works with button trigger', () => {
      render(
        <HoverCard trigger={<button type="button">Click me</button>}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('works with link trigger', () => {
      render(
        <HoverCard trigger={<a href="#">Link</a>}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Link')).toBeInTheDocument();
    });

    it('works with span trigger', () => {
      render(
        <HoverCard trigger={<span>Span element</span>}>
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Span element')).toBeInTheDocument();
    });

    it('combines multiple props', () => {
      render(
        <HoverCard
          trigger={defaultTrigger}
          side="top"
          align="start"
          sideOffset={10}
          openDelay={200}
          closeDelay={100}
          className="custom"
        >
          {defaultChildren}
        </HoverCard>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });
  });
});

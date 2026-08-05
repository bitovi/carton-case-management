import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

describe('Popover', () => {
  it('renders trigger and content when open', async () => {
    const user = userEvent.setup();
    
    render(
      <Popover>
        <PopoverTrigger asChild>
          <button>Open popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open popover' });
    expect(trigger).toBeInTheDocument();

    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('can be controlled', () => {
    const onOpenChange = vi.fn();
    
    render(
      <Popover open={true} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button>Open popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('applies custom className to content', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger asChild>
          <button>Open popover</button>
        </PopoverTrigger>
        <PopoverContent className="custom-popover">
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    const content = screen.getByText('Popover content').parentElement;
    expect(content).toHaveClass('custom-popover');
  });

  it('handles asChild prop on trigger', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger asChild>
          <div data-testid="custom-trigger">Custom trigger</div>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
  });

  it('shows header for non-Menu variants', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger asChild>
          <button>Open popover</button>
        </PopoverTrigger>
        <PopoverContent headerTitle="Test Title" headerDescription="Test description">
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('hides header for Menu variant', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger asChild>
          <button>Open popover</button>
        </PopoverTrigger>
        <PopoverContent content="Menu" headerTitle="Test Title" headerDescription="Test description">
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('shows header only when headerTitle is provided for non-Menu variants', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger asChild>
          <button>Open popover</button>
        </PopoverTrigger>
        <PopoverContent headerDescription="Test description">
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });
});
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  const defaultItems = [
    {
      value: 'item-1',
      trigger: 'Section 1',
      content: 'Content 1',
    },
    {
      value: 'item-2',
      trigger: 'Section 2',
      content: 'Content 2',
    },
    {
      value: 'item-3',
      trigger: 'Section 3',
      content: 'Content 3',
    },
  ];

  it('renders all accordion items', () => {
    render(<Accordion type="single" collapsible items={defaultItems} />);
    
    expect(screen.getByRole('button', { name: 'Section 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Section 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Section 3' })).toBeInTheDocument();
  });

  it('opens accordion item on click', async () => {
    const user = userEvent.setup();
    render(<Accordion type="single" collapsible items={defaultItems} />);
    
    const button = screen.getByRole('button', { name: 'Section 1' });
    await user.click(button);
    
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(button).toHaveAttribute('data-state', 'open');
  });

  it('closes accordion item on second click', async () => {
    const user = userEvent.setup();
    render(<Accordion type="single" collapsible items={defaultItems} />);
    
    const button = screen.getByRole('button', { name: 'Section 2' });
    await user.click(button);
    expect(button).toHaveAttribute('data-state', 'open');
    
    await user.click(button);
    expect(button).toHaveAttribute('data-state', 'closed');
  });

  it('renders with default value open', () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-2" items={defaultItems} />
    );
    
    const button = screen.getByRole('button', { name: 'Section 2' });
    expect(button).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  it('supports multiple type allowing multiple items open', async () => {
    const user = userEvent.setup();
    render(<Accordion type="multiple" items={defaultItems} />);
    
    const button1 = screen.getByRole('button', { name: 'Section 1' });
    const button2 = screen.getByRole('button', { name: 'Section 2' });
    
    await user.click(button1);
    await user.click(button2);
    
    expect(button1).toHaveAttribute('data-state', 'open');
    expect(button2).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Accordion type="single" collapsible items={defaultItems} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes triggerProps to AccordionTrigger', () => {
    const itemsWithProps = [
      {
        value: 'item-1',
        trigger: 'Section 1',
        content: 'Content 1',
        triggerProps: { className: 'custom-trigger' },
      },
    ];
    
    render(<Accordion type="single" collapsible items={itemsWithProps} />);
    
    const button = screen.getByRole('button', { name: 'Section 1' });
    expect(button).toHaveClass('custom-trigger');
  });

  it('passes contentProps to AccordionContent', () => {
    const itemsWithProps = [
      {
        value: 'item-1',
        trigger: 'Section 1',
        content: 'Content 1',
        contentProps: { className: 'custom-content' },
      },
    ];
    
    const { container } = render(
      <Accordion type="single" collapsible defaultValue="item-1" items={itemsWithProps} />
    );
    
    const content = container.querySelector('.custom-content');
    expect(content).toBeInTheDocument();
  });
});

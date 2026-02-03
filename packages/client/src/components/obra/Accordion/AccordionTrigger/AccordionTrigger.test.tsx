import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Accordion from '@radix-ui/react-accordion';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from '../AccordionContent';

describe('AccordionTrigger', () => {
  const renderTrigger = (props = {}) => {
    return render(
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="test-item">
          <AccordionTrigger {...props}>Test Label</AccordionTrigger>
          <AccordionContent>Test content</AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
    );
  };

  it('renders with children text', () => {
    renderTrigger();
    expect(screen.getByRole('button', { name: /test label/i })).toBeInTheDocument();
  });

  it('renders chevron icon', () => {
    renderTrigger();
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('toggles accordion content on click', async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="test-item">
          <AccordionTrigger>Test Label</AccordionTrigger>
          <AccordionContent>Test content</AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-state', 'closed');
    
    await user.click(button);
    expect(button).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Test content')).toBeVisible();
    
    await user.click(button);
    expect(button).toHaveAttribute('data-state', 'closed');
  });

  it('applies custom className', () => {
    renderTrigger({ className: 'custom-class' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('rotates chevron when open', async () => {
    const user = userEvent.setup();
    renderTrigger();
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(button).toHaveAttribute('data-state', 'open');
  });
});

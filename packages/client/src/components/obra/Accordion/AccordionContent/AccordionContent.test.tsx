import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Accordion from '@radix-ui/react-accordion';
import { AccordionTrigger } from '../AccordionTrigger';
import { AccordionContent } from './AccordionContent';

describe('AccordionContent', () => {
  const renderContent = (props = {}) => {
    return render(
      <Accordion.Root type="single" collapsible defaultValue="test-item">
        <Accordion.Item value="test-item">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent {...props}>Test content</AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
    );
  };

  it('renders children when accordion is open', () => {
    renderContent();
    expect(screen.getByText('Test content')).toBeVisible();
  });

  it('hides content when accordion is closed', async () => {
    const user = userEvent.setup();
    renderContent();
    
    const button = screen.getByRole('button');
    const content = screen.getByText('Test content');
    expect(content).toBeVisible();
    
    await user.click(button);
    
    expect(content).not.toBeVisible();
  });

  it('applies custom className to wrapper div', () => {
    const { container } = renderContent({ className: 'custom-class' });
    const contentDiv = container.querySelector('.custom-class');
    expect(contentDiv).toBeInTheDocument();
  });

  it('renders rich content', () => {
    render(
      <Accordion.Root type="single" collapsible defaultValue="test-item">
        <Accordion.Item value="test-item">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>
            <div data-testid="rich-content">
              <p>Paragraph</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
    );
    
    expect(screen.getByTestId('rich-content')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});

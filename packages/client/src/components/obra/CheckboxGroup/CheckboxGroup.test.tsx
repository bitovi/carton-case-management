import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CheckboxGroup } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  it('should render with label', () => {
    render(<CheckboxGroup label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render checkbox and label inline by default', () => {
    const { container } = render(<CheckboxGroup label="Label" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('inline-flex');
  });

  it('should render checkbox and label in block layout', () => {
    const { container } = render(<CheckboxGroup label="Label" layout="block" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('flex');
    expect(label).not.toHaveClass('inline-flex');
  });

  it('should render unchecked checkbox by default', () => {
    render(<CheckboxGroup label="Label" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('should render checked checkbox when checked prop is true', () => {
    render(<CheckboxGroup label="Label" checked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onCheckedChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckboxGroup label="Label" onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should apply custom className', () => {
    const { container } = render(<CheckboxGroup label="Label" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should make label clickable', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckboxGroup label="Test Label" onCheckedChange={handleChange} />);
    
    await user.click(screen.getByText('Test Label'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

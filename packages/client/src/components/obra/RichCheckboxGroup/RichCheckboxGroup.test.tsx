import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RichCheckboxGroup } from './RichCheckboxGroup';

describe('RichCheckboxGroup', () => {
  it('should render with label', () => {
    render(<RichCheckboxGroup label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render with border', () => {
    const { container } = render(<RichCheckboxGroup label="Label" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('border', 'border-border', 'rounded-lg');
  });

  it('should render checkbox on left and label on right by default', () => {
    const { container } = render(<RichCheckboxGroup label="Label" />);
    const label = container.querySelector('label');
    const firstChild = label?.firstChild;
    const checkbox = screen.getByRole('checkbox');
    expect(firstChild).toBe(checkbox);
  });

  it('should render label on left and checkbox on right when flipped', () => {
    const { container } = render(<RichCheckboxGroup label="Test Label" flipped={true} />);
    const label = container.querySelector('label');
    const firstChild = label?.firstChild;
    const labelContainer = screen.getByText('Test Label').parentElement;
    expect(firstChild).toBe(labelContainer);
  });

  it('should render unchecked checkbox by default', () => {
    render(<RichCheckboxGroup label="Label" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('should render checked checkbox when checked prop is true', () => {
    render(<RichCheckboxGroup label="Label" checked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onCheckedChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RichCheckboxGroup label="Label" onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should apply custom className', () => {
    const { container } = render(<RichCheckboxGroup label="Label" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should make entire container clickable', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RichCheckboxGroup label="Test Label" onCheckedChange={handleChange} />);
    
    await user.click(screen.getByText('Test Label'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should render secondary text when showLine2 is true', () => {
    render(
      <RichCheckboxGroup
        label="Primary Label"
        showLine2={true}
        secondaryText="Secondary text"
      />
    );
    expect(screen.getByText('Primary Label')).toBeInTheDocument();
    expect(screen.getByText('Secondary text')).toBeInTheDocument();
  });

  it('should not render secondary text when showLine2 is false', () => {
    render(
      <RichCheckboxGroup
        label="Primary Label"
        showLine2={false}
        secondaryText="Secondary text"
      />
    );
    expect(screen.getByText('Primary Label')).toBeInTheDocument();
    expect(screen.queryByText('Secondary text')).not.toBeInTheDocument();
  });

  it('should render secondary text in flipped layout', () => {
    render(
      <RichCheckboxGroup
        label="Primary Label"
        flipped={true}
        showLine2={true}
        secondaryText="Secondary text"
      />
    );
    const labelText = screen.getByText('Primary Label');
    const secondaryText = screen.getByText('Secondary text');
    expect(labelText).toBeInTheDocument();
    expect(secondaryText).toBeInTheDocument();
  });
});

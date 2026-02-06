import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OldTextarea } from './OldTextarea';

describe('OldTextarea', () => {
  it('should render correctly', () => {
    render(<OldTextarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should render with roundness="default"', () => {
    render(<OldTextarea roundness="default" placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test')).toHaveClass('rounded-md');
  });

  it('should render with roundness="round"', () => {
    render(<OldTextarea roundness="round" placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test')).toHaveClass('rounded-lg');
  });

  it('should be resizable by default', () => {
    render(<OldTextarea placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test')).toHaveClass('resize-vertical');
  });

  it('should not be resizable when showResizable=false', () => {
    render(<OldTextarea showResizable={false} placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test')).toHaveClass('resize-none');
  });

  it('should apply error styling when error=true', () => {
    render(<OldTextarea error placeholder="Test" />);
    const textarea = screen.getByPlaceholderText('Test');
    expect(textarea).toHaveClass('!border-[#ef4444]');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not have aria-invalid when error=false', () => {
    render(<OldTextarea error={false} placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test')).not.toHaveAttribute('aria-invalid');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<OldTextarea disabled placeholder="Disabled textarea" />);
    expect(screen.getByPlaceholderText('Disabled textarea')).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<OldTextarea className="custom-class" placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test')).toHaveClass('custom-class');
  });

  it('should support defaultValue', () => {
    render(<OldTextarea defaultValue="Initial value" />);
    expect(screen.getByDisplayValue('Initial value')).toBeInTheDocument();
  });

  it('should support placeholder', () => {
    render(<OldTextarea placeholder="Type your message here." />);
    expect(screen.getByPlaceholderText('Type your message here.')).toBeInTheDocument();
  });

  it('should combine roundness, error, and resize props', () => {
    render(<OldTextarea roundness="round" error showResizable={false} placeholder="Test" />);
    const textarea = screen.getByPlaceholderText('Test');
    expect(textarea).toHaveClass('rounded-lg');
    expect(textarea).toHaveClass('!border-[#ef4444]');
    expect(textarea).toHaveClass('resize-none');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });
});

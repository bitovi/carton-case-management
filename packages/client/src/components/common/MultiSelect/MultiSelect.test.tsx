import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { User } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('MultiSelect', () => {
  describe('Basic Functionality', () => {
    it('should render with label and placeholder in stacked layout', () => {
      render(
        <MultiSelect
          label="Test Label"
          layout="stacked"
          options={mockOptions}
          value={[]}
          onChange={() => {}}
        />
      );
      
      expect(screen.getByText('Test Label (0)')).toBeInTheDocument();
      expect(screen.getByText('None selected')).toBeInTheDocument();
    });
    
    it('should show count when options are selected', () => {
      render(
        <MultiSelect
          label="Status"
          options={mockOptions}
          value={['option1']}
          onChange={() => {}}
        />
      );
      
      expect(screen.getByText('Status (1)')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    it('should show "N selected" when multiple options are selected', () => {
      render(
        <MultiSelect
          label="Priority"
          options={mockOptions}
          value={['option1', 'option2']}
          onChange={() => {}}
        />
      );
      
      expect(screen.getByText('Priority (2)')).toBeInTheDocument();
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });
    
    it('should open popover on click', async () => {
      render(
        <MultiSelect
          label="Customer"
          options={mockOptions}
          value={[]}
          onChange={() => {}}
        />
      );
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      await waitFor(() => {
        mockOptions.forEach(option => {
          expect(screen.getAllByText(option.label).length).toBeGreaterThan(0);
        });
      });
    });
    
    it('should call onChange when option is toggled', async () => {
      const onChange = vi.fn();
      
      render(
        <MultiSelect
          label="Status"
          options={mockOptions}
          value={[]}
          onChange={onChange}
        />
      );
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });
      
      expect(onChange).toHaveBeenCalledWith(['option1']);
    });
    
    it('should remove option when already selected', async () => {
      const onChange = vi.fn();
      
      render(
        <MultiSelect
          label="Priority"
          options={mockOptions}
          value={['option1', 'option2']}
          onChange={onChange}
        />
      );
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });
      
      expect(onChange).toHaveBeenCalledWith(['option2']);
    });
  });
  
  describe('Layout Variants', () => {
    it('should render single layout without label count', () => {
      render(
        <MultiSelect
          layout="single"
          label="Test Label"
          options={mockOptions}
          value={['option1']}
          onChange={() => {}}
        />
      );
      
      expect(screen.queryByText('Test Label (1)')).not.toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    it('should render prepend text in single layout', () => {
      render(
        <MultiSelect
          layout="single"
          prependText="Filter:"
          options={mockOptions}
          value={[]}
          onChange={() => {}}
        />
      );
      
      expect(screen.getByText('Filter:')).toBeInTheDocument();
    });
  });
  
  describe('Size Variants', () => {
    it.each([
      ['mini' as const],
      ['small' as const],
      ['regular' as const],
      ['large' as const],
    ])('should render %s size', (size) => {
      const { container } = render(
        <MultiSelect
          size={size}
          label="Test"
          options={mockOptions}
          value={[]}
          onChange={() => {}}
        />
      );
      
      expect(container.querySelector('button')).toBeInTheDocument();
    });
  });
  
  describe('Error State', () => {
    it('should apply error styling when error is true', () => {
      const { container } = render(
        <MultiSelect
          label="Test"
          options={mockOptions}
          value={[]}
          error={true}
          onChange={() => {}}
        />
      );
      
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-[var(--destructive-border)]');
    });
    
    it('should not apply error styling when error is false', () => {
      const { container } = render(
        <MultiSelect
          label="Test"
          options={mockOptions}
          value={[]}
          error={false}
          onChange={() => {}}
        />
      );
      
      const button = container.querySelector('button');
      expect(button).not.toHaveClass('border-[var(--destructive-border)]');
    });
  });
  
  describe('Disabled State', () => {
    it('should disable trigger when disabled is true', () => {
      render(
        <MultiSelect
          label="Test"
          options={mockOptions}
          value={[]}
          disabled={true}
          onChange={() => {}}
        />
      );
      
      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
    });
    
    it('should not open popover when disabled', async () => {
      render(
        <MultiSelect
          label="Test"
          options={mockOptions}
          value={[]}
          disabled={true}
          onChange={() => {}}
        />
      );
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      });
    });
    
    it('should not call onChange when disabled and option is clicked', async () => {
      const onChange = vi.fn();
      
      render(
        <MultiSelect
          label="Test"
          options={mockOptions}
          value={[]}
          disabled={false}
          onChange={onChange}
        />
      );
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });
      
      expect(onChange).toHaveBeenCalled();
    });
  });
  
  describe('Decorations', () => {
    it('should render left decoration', () => {
      render(
        <MultiSelect
          label="Test"
          leftDecoration={<User data-testid="user-icon" />}
          options={mockOptions}
          value={[]}
          onChange={() => {}}
        />
      );
      
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });
  });
});


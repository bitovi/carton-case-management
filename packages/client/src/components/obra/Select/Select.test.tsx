import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectOverflowIndicator,
} from './Select';
import { User } from 'lucide-react';

describe('Select', () => {

  
  describe('SelectTrigger - Size Variants', () => {
    it('renders mini size with correct classes', () => {
      render(
        <Select>
          <SelectTrigger size="mini" placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8', 'px-1.5', 'gap-1');
    });

    it('renders small size with correct classes', () => {
      render(
        <Select>
          <SelectTrigger size="small" placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8', 'px-2', 'gap-1.5');
    });

    it('renders regular size with correct classes (default)', () => {
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-9', 'pl-3', 'pr-2', 'gap-2');
    });

    it('renders large size with correct classes', () => {
      render(
        <Select>
          <SelectTrigger size="large" placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-10', 'pl-4', 'pr-2', 'gap-3');
    });
  });



  describe('SelectTrigger - Layout Variants', () => {
    it('renders single line layout by default', () => {
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('flex-row', 'items-center');
    });

    it('renders stacked layout with label', () => {
      render(
        <Select>
          <SelectTrigger layout="stacked" label="Field Label" placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByText('Field Label')).toBeInTheDocument();
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('flex-col', 'items-start');
    });

    it('does not show label in single line layout', () => {
      render(
        <Select>
          <SelectTrigger layout="single" label="Field Label" placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.queryByText('Field Label')).not.toBeInTheDocument();
    });
  });


  describe('SelectTrigger - Prepend Text', () => {
    it('renders prepend text in single layout', () => {
      render(
        <Select>
          <SelectTrigger prependText="Status:" placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByText('Status:')).toBeInTheDocument();
    });

    it('does not render prepend text in stacked layout', () => {
      render(
        <Select>
          <SelectTrigger layout="stacked" prependText="Status:" placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.queryByText('Status:')).not.toBeInTheDocument();
    });
  });


  describe('SelectTrigger - Error State', () => {
    it('applies error styling when error is true', () => {
      render(
        <Select>
          <SelectTrigger error placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-destructive');
    });

    it('applies normal styling when error is false', () => {
      render(
        <Select>
          <SelectTrigger error={false} placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-border');
    });
  });


  describe('SelectTrigger - Disabled State', () => {
    it('disables trigger when disabled is true', () => {
      render(
        <Select>
          <SelectTrigger disabled placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });


  describe('SelectTrigger - Placeholder and Value', () => {
    it('displays placeholder when no value', () => {
      render(
        <Select>
          <SelectTrigger placeholder="Choose an option" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('displays value when provided', async () => {
      render(
        <Select defaultValue="item1">
          <SelectTrigger placeholder="Choose option" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.queryByText('Choose option')).not.toBeInTheDocument();
    });
  });


  describe('SelectTrigger - Left Decoration', () => {
    it('renders left decoration when provided', () => {
      render(
        <Select>
          <SelectTrigger
            leftDecoration={<User data-testid="left-icon" />}
            placeholder="Select item"
          />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('does not render left decoration when not provided', () => {
      const { container } = render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const decorationContainer = container.querySelector('.w-5.h-5');
      expect(decorationContainer).not.toBeInTheDocument();
    });
  });


  describe('SelectItem - Size Variants', () => {
    it('renders regular size items with correct classes', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem size="regular" value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const item = screen.getByRole('option', { name: 'Item 1' });
      expect(item).toHaveClass('h-8', 'px-2');
    });

    it('renders large size items with correct classes', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem size="large" value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const item = screen.getByRole('option', { name: 'Item 1' });
      expect(item).toHaveClass('h-9', 'px-3');
    });
  });


  describe('SelectItem - Type Variants', () => {
    it('renders default type with correct classes', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem type="default" value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const item = screen.getByRole('option', { name: 'Item 1' });
      expect(item).toHaveClass('text-foreground');
    });

    it('renders destructive type with correct classes', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select action" />
          <SelectContent>
            <SelectItem type="destructive" value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const item = screen.getByRole('option', { name: 'Delete' });
      expect(item).toHaveClass('text-destructive');
    });
  });


  describe('SelectItem - Decorations and Descriptions', () => {
    it('renders left decoration in item', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem 
              value="item1" 
              leftDecoration={<User data-testid="item-icon" />}
            >
              Item 1
            </SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByTestId('item-icon')).toBeInTheDocument();
    });

    it('renders description text', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1" description="This is a description">
              Item 1
            </SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });
  });


  describe('SelectItem - Disabled State', () => {
    it('disables item when disabled is true', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1" disabled>Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const item = screen.getByRole('option', { name: 'Item 1' });
      expect(item).toHaveAttribute('data-disabled');
    });
  });


  describe('SelectContent - Spacing Variants', () => {
    it('applies no spacing with spacing="none"', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent spacing="none">
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const content = container.querySelector('[role="listbox"]');
      expect(content).toHaveClass('p-0');
    });

    it('applies 8px spacing', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent spacing="8px">
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const content = container.querySelector('[role="listbox"]');
      expect(content).toHaveClass('p-2');
    });
  });



  describe('SelectLabel', () => {
    it('renders small label with correct classes', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectLabel size="small">Group 1</SelectLabel>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const label = screen.getByText('Group 1');
      expect(label).toHaveClass('text-xs', 'px-2');
    });

    it('renders indented label with correct padding', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectLabel indented>Indented Group</SelectLabel>
            <SelectItem value="item1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const label = screen.getByText('Indented Group');
      expect(label).toHaveClass('pl-8');
    });
  });



  describe('SelectSeparator', () => {
    it('renders separator', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      const separator = container.querySelector('[role="separator"]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('h-px', 'bg-border');
    });
  });



  describe('SelectOverflowIndicator', () => {
    it('renders up indicator', () => {
      render(<SelectOverflowIndicator direction="up" />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('lucide-chevron-up');
    });

    it('renders down indicator', () => {
      render(<SelectOverflowIndicator direction="down" />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('lucide-chevron-down');
    });
  });


  describe('Integration', () => {
    it('opens menu when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Item 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Item 2' })).toBeInTheDocument();
    });

    it('selects item when clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      
      render(
        <Select onValueChange={onValueChange}>
          <SelectTrigger placeholder="Select item" />
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Item 1' }));
      
      expect(onValueChange).toHaveBeenCalledWith('item1');
    });
  });
});

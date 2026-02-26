import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SvgIcon } from '@progress/kendo-react-common';
import { pencilIcon } from '@progress/kendo-svg-icons';
import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';
import { Button } from '@/components/obra/Button';

describe('MoreOptionsMenu', () => {
  it('renders with default trigger and opens on click', async () => {
    const user = userEvent.setup();

    render(
      <MoreOptionsMenu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </MoreOptionsMenu>
    );

    const triggerButton = screen.getByRole('button', { name: /more options/i });
    expect(triggerButton).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();

    await user.click(triggerButton);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders with custom trigger', async () => {
    const user = userEvent.setup();
    const customTrigger = <Button variant="outline">Custom Trigger</Button>;

    render(
      <MoreOptionsMenu trigger={customTrigger}>
        <MenuItem>Option 1</MenuItem>
      </MoreOptionsMenu>
    );

    const customTriggerButton = screen.getByRole('button', { name: 'Custom Trigger' });
    expect(customTriggerButton).toBeInTheDocument();

    await user.click(customTriggerButton);
    expect(screen.getByRole('button', { name: 'Option 1' })).toBeInTheDocument();
  });

  it('handles controlled open state', () => {
    render(
      <MoreOptionsMenu open={true} onOpenChange={() => {}}>
        <MenuItem>Always Visible</MenuItem>
      </MoreOptionsMenu>
    );

    expect(screen.getByRole('button', { name: 'Always Visible' })).toBeInTheDocument();
  });

  it('calls onOpenChange when state changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <MoreOptionsMenu onOpenChange={onOpenChange}>
        <MenuItem>Test Item</MenuItem>
      </MoreOptionsMenu>
    );

    const triggerButton = screen.getByRole('button', { name: /more options/i });
    await user.click(triggerButton);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('supports different positioning props', async () => {
    const user = userEvent.setup();

    render(
      <MoreOptionsMenu side="top" align="start" sideOffset={10}>
        <MenuItem>Positioned Item</MenuItem>
      </MoreOptionsMenu>
    );

    const triggerButton = screen.getByRole('button', { name: /more options/i });
    await user.click(triggerButton);

    // Menu should be visible (positioning is tested via Radix internally)
    expect(screen.getByRole('button', { name: 'Positioned Item' })).toBeInTheDocument();
  });

  it('uses custom aria-label', () => {
    render(
      <MoreOptionsMenu aria-label="User actions">
        <MenuItem>Test</MenuItem>
      </MoreOptionsMenu>
    );

    expect(screen.getByRole('button', { name: 'User actions' })).toBeInTheDocument();
  });
});

describe('MenuItem', () => {
  it('renders with text content', () => {
    render(<MenuItem>Test MenuItem</MenuItem>);

    expect(screen.getByRole('button', { name: 'Test MenuItem' })).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <MenuItem icon={<SvgIcon icon={pencilIcon} size="small" data-testid="edit-icon" />}>
        Edit Item
      </MenuItem>
    );

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Item' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<MenuItem onClick={onClick}>Clickable Item</MenuItem>);

    const menuItem = screen.getByRole('button', { name: 'Clickable Item' });
    await user.click(menuItem);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <MenuItem onClick={onClick} disabled>
        Disabled Item
      </MenuItem>
    );

    const menuItem = screen.getByRole('button', { name: 'Disabled Item' });
    expect(menuItem).toBeDisabled();

    await user.click(menuItem);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<MenuItem onClick={onClick}>Keyboard Item</MenuItem>);

    const menuItem = screen.getByRole('button', { name: 'Keyboard Item' });

    menuItem.focus();
    expect(menuItem).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

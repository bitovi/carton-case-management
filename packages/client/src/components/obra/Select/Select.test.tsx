import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
} from './index';

describe('Select', () => {
  describe('SelectTrigger', () => {
    it('renders with default size', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-9');
    });

    it('renders with large size', () => {
      render(
        <Select>
          <SelectTrigger size="lg">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-10');
    });

    it('renders with small size', () => {
      render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8');
    });

    it('renders with mini size', () => {
      render(
        <Select>
          <SelectTrigger size="mini">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8');
      expect(trigger).toHaveClass('text-xs');
    });

    it('renders with error state', () => {
      render(
        <Select>
          <SelectTrigger state="error">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-destructive');
    });

    it('renders with double lines', () => {
      render(
        <Select>
          <SelectTrigger lines="double">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('min-h-[52px]');
    });

    it('has data-slot attribute', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    });

    it('applies custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-class">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-class');
    });
  });

  describe('SelectItem', () => {
    it('renders with children', async () => {
      render(
        <Select defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );
      // Item text should be in the trigger when selected
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('renders with default variant styling', async () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );
      // Radix renders content in a portal, query from document.body
      const item = document.body.querySelector('[data-slot="select-item"]');
      expect(item).toBeTruthy();
      expect(item).not.toHaveClass('text-destructive');
    });
  });

  describe('SelectLabel', () => {
    it('renders with default size', () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group Label</SelectLabel>
              <SelectItem value="item">Item</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      // Radix renders content in a portal, query from document.body
      const label = document.body.querySelector('[data-slot="select-label"]');
      expect(label).toBeTruthy();
      expect(label).toHaveClass('text-sm');
    });

    it('renders with small size', () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel size="sm">Small Label</SelectLabel>
              <SelectItem value="item">Item</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      // Radix renders content in a portal, query from document.body
      const label = document.body.querySelector('[data-slot="select-label"]');
      expect(label).toBeTruthy();
      expect(label).toHaveClass('text-xs');
    });

    it('renders with indented variant', () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel indented>Indented Label</SelectLabel>
              <SelectItem value="item">Item</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      // Radix renders content in a portal, query from document.body
      const label = document.body.querySelector('[data-slot="select-label"]');
      expect(label).toBeTruthy();
      expect(label).toHaveClass('pl-8');
    });
  });

  describe('Full composition', () => {
    it('renders complete select with groups', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select a fruit')).toBeInTheDocument();
    });
  });
});

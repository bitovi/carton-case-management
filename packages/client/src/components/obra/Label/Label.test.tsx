import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Label>Email address</Label>);
      expect(screen.getByText('Email address')).toBeInTheDocument();
    });

    it('renders as a label element', () => {
      render(<Label>Test label</Label>);
      expect(screen.getByText('Test label').tagName).toBe('LABEL');
    });

    it('has data-slot attribute', () => {
      render(<Label>Test label</Label>);
      expect(screen.getByText('Test label')).toHaveAttribute(
        'data-slot',
        'label'
      );
    });
  });

  describe('layout variants', () => {
    it('applies block layout by default', () => {
      render(<Label>Block label</Label>);
      expect(screen.getByText('Block label')).toHaveClass('block');
    });

    it('applies block layout when explicitly set', () => {
      render(<Label layout="block">Block label</Label>);
      expect(screen.getByText('Block label')).toHaveClass('block');
    });

    it('applies inline layout', () => {
      render(<Label layout="inline">Inline label</Label>);
      expect(screen.getByText('Inline label')).toHaveClass('inline');
    });
  });

  describe('styling', () => {
    it('has correct base typography styles', () => {
      render(<Label>Styled label</Label>);
      const label = screen.getByText('Styled label');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
      expect(label).toHaveClass('leading-none');
    });

    it('applies custom className', () => {
      render(<Label className="custom-class">Custom label</Label>);
      expect(screen.getByText('Custom label')).toHaveClass('custom-class');
    });

    it('merges custom className with variant classes', () => {
      render(
        <Label layout="inline" className="custom-class">
          Merged label
        </Label>
      );
      const label = screen.getByText('Merged label');
      expect(label).toHaveClass('inline');
      expect(label).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('associates with form control via htmlFor', () => {
      render(
        <>
          <Label htmlFor="test-input">Test label</Label>
          <input id="test-input" type="text" />
        </>
      );
      expect(screen.getByText('Test label')).toHaveAttribute(
        'for',
        'test-input'
      );
    });

    it('has peer-disabled styles in className', () => {
      render(<Label>Disabled aware label</Label>);
      const label = screen.getByText('Disabled aware label');
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
      expect(label).toHaveClass('peer-disabled:opacity-70');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the label element', () => {
      const ref = { current: null as HTMLLabelElement | null };
      render(<Label ref={ref}>Ref label</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current?.textContent).toBe('Ref label');
    });
  });

  describe('HTML attributes', () => {
    it('passes through HTML attributes', () => {
      render(<Label data-testid="label-test">Attribute label</Label>);
      expect(screen.getByTestId('label-test')).toBeInTheDocument();
    });

    it('supports id attribute', () => {
      render(<Label id="my-label">ID label</Label>);
      expect(screen.getByText('ID label')).toHaveAttribute('id', 'my-label');
    });
  });
});

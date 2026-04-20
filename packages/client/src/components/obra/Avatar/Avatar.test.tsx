import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  describe('Fallback rendering', () => {
    it('should render fallback text when no src', () => {
      render(<Avatar fallback="JD" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should render "?" when no src and no fallback', () => {
      render(<Avatar />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });
  });

  describe('Image rendering', () => {
    it('should render an img when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="Test user" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should fall back to fallback text on image error', () => {
      render(<Avatar src="bad-url.jpg" fallback="JD" alt="Test user" />);
      fireEvent.error(screen.getByRole('img'));
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should apply sm size classes', () => {
      const { container } = render(<Avatar fallback="AB" size="sm" />);
      expect(container.firstChild).toHaveClass('size-6');
    });

    it('should apply md size classes by default', () => {
      const { container } = render(<Avatar fallback="AB" />);
      expect(container.firstChild).toHaveClass('size-8');
    });

    it('should apply lg size classes', () => {
      const { container } = render(<Avatar fallback="AB" size="lg" />);
      expect(container.firstChild).toHaveClass('size-10');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<Avatar fallback="AB" className="ring-2" />);
      expect(container.firstChild).toHaveClass('ring-2');
    });
  });
});

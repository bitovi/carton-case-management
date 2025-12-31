import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithTrpc } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CaseInformation } from './CaseInformation';

describe('CaseInformation', () => {
  const mockOnMenuClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: 'Test description',
    };

    renderWithTrpc(
      <CaseInformation caseId="1" caseData={mockCaseData} onMenuClick={mockOnMenuClick} />
    );

    expect(screen.getAllByText('Test Case').length).toBeGreaterThan(0);
    const caseNumbers = screen.getAllByText((content, element) => {
      return element?.textContent === '#CASE-001';
    });
    expect(caseNumbers.length).toBeGreaterThan(0);
  });

  it('renders rich text renderer in view mode', () => {
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: JSON.stringify([
        {
          type: 'paragraph',
          children: [{ text: 'Rich text description' }],
        },
      ]),
    };

    renderWithTrpc(
      <CaseInformation caseId="1" caseData={mockCaseData} onMenuClick={mockOnMenuClick} />
    );

    expect(screen.getByText('Rich text description')).toBeInTheDocument();
  });

  it('switches to edit mode with rich text editor when description is clicked', async () => {
    const user = userEvent.setup();
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: JSON.stringify([
        {
          type: 'paragraph',
          children: [{ text: 'Click to edit' }],
        },
      ]),
    };

    renderWithTrpc(
      <CaseInformation caseId="1" caseData={mockCaseData} onMenuClick={mockOnMenuClick} />
    );

    // Click on the description to edit
    const description = screen.getByText('Click to edit');
    await user.click(description);

    // Should show editor with Save and Cancel buttons
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    // Should show toolbar with formatting buttons
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
  });

  it('reverts changes when cancel is clicked', async () => {
    const user = userEvent.setup();
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: JSON.stringify([
        {
          type: 'paragraph',
          children: [{ text: 'Original text' }],
        },
      ]),
    };

    renderWithTrpc(
      <CaseInformation caseId="1" caseData={mockCaseData} onMenuClick={mockOnMenuClick} />
    );

    // Enter edit mode
    await user.click(screen.getByText('Original text'));

    // Should be in edit mode
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Should return to view mode
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
      expect(screen.getByText('Original text')).toBeInTheDocument();
    });
  });

  it('handles plain text descriptions for backward compatibility', () => {
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: 'Plain text description without JSON',
    };

    renderWithTrpc(
      <CaseInformation caseId="1" caseData={mockCaseData} onMenuClick={mockOnMenuClick} />
    );

    // Should display the plain text
    expect(screen.getByText('Plain text description without JSON')).toBeInTheDocument();
  });

  it('displays character count in edit mode', async () => {
    const user = userEvent.setup();
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: JSON.stringify([
        {
          type: 'paragraph',
          children: [{ text: 'Test description' }],
        },
      ]),
    };

    renderWithTrpc(
      <CaseInformation caseId="1" caseData={mockCaseData} onMenuClick={mockOnMenuClick} />
    );

    // Enter edit mode
    await user.click(screen.getByText('Test description'));

    // Should show character count
    await waitFor(() => {
      expect(screen.getByText(/\/ 10,000 characters/)).toBeInTheDocument();
    });
  });

  it('renders rich text with formatting marks', () => {
    const mockCaseData = {
      title: 'Test Case',
      caseNumber: 'CASE-001',
      status: 'TO_DO' as const,
      description: JSON.stringify([
        {
          type: 'paragraph',
          children: [
            { text: 'Plain text ' },
            { text: 'bold text', bold: true },
            { text: ' and ' },
            { text: 'italic text', italic: true },
          ],
        },
      ]),
    };

    renderWithTrpc(
      <CaseInformation caseId="1" caseData={mockCaseData} onMenuClick={mockOnMenuClick} />
    );

    expect(screen.getByText('Plain text')).toBeInTheDocument();

    const boldText = screen.getByText('bold text');
    expect(boldText.tagName).toBe('STRONG');

    const italicText = screen.getByText('italic text');
    expect(italicText.tagName).toBe('EM');
  });
});

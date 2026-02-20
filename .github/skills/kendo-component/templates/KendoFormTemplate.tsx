// KendoUI Form Component Template
// Use this as a starting point for form components with validation

import React, { useState } from 'react';
import { Form } from '@progress/kendo-react-form';
import { Fieldset } from '@progress/kendo-react-form';
import { TextBox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';
import { Error } from '@progress/kendo-react-labels';
import './KendoFormTemplate.css';

interface FormTemplateProps {
  onSubmit: (formData: any) => void | Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: any;
}

interface FormData {
  name: string;
  email: string;
  status: string;
  date: Date | null;
  notes: string;
}

export function KendoFormTemplate({
  onSubmit,
  isSubmitting = false,
  defaultValues = {},
}: FormTemplateProps) {
  const [formData, setFormData] = useState<Partial<FormData>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to submit form' });
    }
  };

  const handleFieldChange = (e: any, fieldName: string) => {
    const value = e.value !== undefined ? e.value : e.target?.value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear field error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="kendo-form-template">
      <Fieldset title="Form Fields" description="Fill out all required fields">
        {/* Text Input Field */}
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <TextBox
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={(e) => handleFieldChange(e, 'name')}
            disabled={isSubmitting}
            placeholder="Enter your name"
            type="text"
          />
          {errors.name && <Error>{errors.name}</Error>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <TextBox
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={(e) => handleFieldChange(e, 'email')}
            disabled={isSubmitting}
            placeholder="Enter your email"
            type="email"
          />
          {errors.email && <Error>{errors.email}</Error>}
        </div>

        {/* Dropdown Field */}
        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <DropDownList
            id="status"
            name="status"
            data={['Open', 'Closed', 'Pending']}
            value={formData.status}
            onChange={(e) => handleFieldChange(e, 'status')}
            disabled={isSubmitting}
          />
          {errors.status && <Error>{errors.status}</Error>}
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <DatePicker
            id="date"
            name="date"
            value={formData.date}
            onChange={(e) => handleFieldChange(e, 'date')}
            disabled={isSubmitting}
            format="MM/dd/yyyy"
          />
          {errors.date && <Error>{errors.date}</Error>}
        </div>

        {/* Notes Field (multi-line) */}
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={(e) => handleFieldChange({ target: e.target, value: e.target.value }, 'notes')}
            disabled={isSubmitting}
            placeholder="Additional notes"
            className="form-textarea"
            rows={4}
          />
          {errors.notes && <Error>{errors.notes}</Error>}
        </div>

        {/* Submit Error */}
        {errors.submit && <Error>{errors.submit}</Error>}
      </Fieldset>

      {/* Form Actions */}
      <div className="form-actions">
        <Button
          type="submit"
          themeColor="primary"
          disabled={isSubmitting}
          onClick={() => {}}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button
          type="reset"
          onClick={() => {
            setFormData(defaultValues);
            setErrors({});
          }}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

/**
 * Validation function - customize based on your requirements
 */
function validateForm(data: Partial<FormData>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name) {
    errors.name = 'Name is required';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default KendoFormTemplate;

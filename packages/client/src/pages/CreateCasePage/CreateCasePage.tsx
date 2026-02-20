import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/obra/Button';
import { Input } from '@/components/obra/Input';
import { Textarea } from '@/components/obra';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/obra/Select';
import { type CasePriority, CASE_PRIORITY_OPTIONS } from '@carton/shared/client';
import { Label } from '@/components/obra/Label';

type ValidationErrors = {
  title?: string;
  description?: string;
  customerId?: string;
};

export function CreateCasePage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<CasePriority>('MEDIUM');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const { data: customers } = trpc.customer.list.useQuery();
  const { data: users } = trpc.user.list.useQuery();
  
  // For now use Alex Morgan as the default user
  const defaultUser = users?.find(
    (user) => user.firstName === 'Alex' && user.lastName === 'Morgan'
  );
  
  const createCase = trpc.case.create.useMutation({
    onSuccess: (data) => {
      utils.case.list.invalidate();
      navigate(`/cases/${data.id}`);
    },
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!title.trim()) {
      errors.title = 'Case title is required';
    }

    if (!description.trim()) {
      errors.description = 'Case description is required';
    }

    if (!customerId) {
      errors.customerId = 'Customer selection is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    validateForm();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setTouched(new Set(['title', 'description', 'customerId']));

    if (!validateForm()) {
      return;
    }

    if (!defaultUser) {
      alert('Default user (Alex Morgan) not found. Please ensure the database is seeded correctly.');
      return;
    }

    createCase.mutate({
      title,
      description,
      customerId,
      assignedTo: assignedTo || undefined,
      priority,
      createdBy: defaultUser.id,
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 h-full flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Case</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Case Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (touched.has('title')) validateForm();
            }}
            onBlur={() => handleBlur('title')}
            placeholder="Enter case title"
            error={touched.has('title') && !!validationErrors.title}
          />
          {touched.has('title') && validationErrors.title && (
            <p className="text-sm text-red-600">{validationErrors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Case Description *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (touched.has('description')) validateForm();
            }}
            onBlur={() => handleBlur('description')}
            placeholder="Enter case description"
            rows={5}
            className={
              touched.has('description') && validationErrors.description ? 'border-red-500' : ''
            }
          />
          {touched.has('description') && validationErrors.description && (
            <p className="text-sm text-red-600">{validationErrors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer" className="text-sm font-medium">
            Customer *
          </Label>
          <Select
            value={customerId}
            onValueChange={(value) => {
              setCustomerId(value);
              setTouched((prev) => new Set(prev).add('customerId'));
              // Clear the error immediately when a value is selected
              if (value) {
                setValidationErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.customerId;
                  return newErrors;
                });
              }
            }}
          >
            <SelectTrigger
              className={`w-full ${touched.has('customerId') && validationErrors.customerId ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers?.map((customer: { id: string; firstName: string; lastName: string }) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.has('customerId') && validationErrors.customerId && (
            <p className="text-sm text-red-600">{validationErrors.customerId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm font-medium">
            Priority *
          </Label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as CasePriority)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...CASE_PRIORITY_OPTIONS].map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="assignedTo" className="text-sm font-medium">
            Assign To (Optional)
          </label>
          <Select
            value={assignedTo || '__EMPTY__'}
            onValueChange={(value) => setAssignedTo(value === '__EMPTY__' ? '' : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__EMPTY__">Unassigned</SelectItem>
              {users?.map((user: { id: string; firstName: string; lastName: string }) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={createCase.isPending}
            className="bg-[#00848b] hover:bg-[#006d73] text-white"
          >
            {createCase.isPending ? 'Creating...' : 'Create Case'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>

        {createCase.isError && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded border border-red-200">
            Failed to create case. Please ensure all required fields are filled correctly.
          </div>
        )}
      </form>
    </div>
  );
}

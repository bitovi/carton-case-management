import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { Label } from '@/components/obra/Label';

type ValidationErrors = {
  summary?: string;
  description?: string;
  caseId?: string;
};

export function CreateTaskPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const utils = trpc.useUtils();

  const presetCaseId = searchParams.get('caseId') || '';

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [caseId, setCaseId] = useState(presetCaseId);
  const [assignedTo, setAssignedTo] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const { data: cases } = trpc.case.list.useQuery();
  const { data: users } = trpc.user.list.useQuery();

  const defaultUser = users?.find(
    (user) => user.firstName === 'Alex' && user.lastName === 'Morgan'
  );

  const createTask = trpc.task.create.useMutation({
    onSuccess: (data) => {
      utils.task.list.invalidate();
      utils.case.getById.invalidate({ id: data.caseId });
      navigate(`/tasks/${data.id}`);
    },
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!summary.trim()) {
      errors.summary = 'Task summary is required';
    }

    if (!description.trim()) {
      errors.description = 'Task description is required';
    }

    if (!caseId) {
      errors.caseId = 'Case selection is required';
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

    setTouched(new Set(['summary', 'description', 'caseId']));

    if (!validateForm()) {
      return;
    }

    if (!defaultUser) {
      alert('Default user (Alex Morgan) not found. Please ensure the database is seeded correctly.');
      return;
    }

    createTask.mutate({
      summary,
      description,
      caseId,
      assignedTo: assignedTo || undefined,
      createdBy: defaultUser.id,
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 h-full flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium">
            Task Summary *
          </Label>
          <Input
            id="summary"
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              if (touched.has('summary')) validateForm();
            }}
            onBlur={() => handleBlur('summary')}
            placeholder="Enter task summary"
            error={touched.has('summary') && !!validationErrors.summary}
          />
          {touched.has('summary') && validationErrors.summary && (
            <p className="text-sm text-red-600">{validationErrors.summary}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Task Description *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (touched.has('description')) validateForm();
            }}
            onBlur={() => handleBlur('description')}
            placeholder="Enter task description"
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
          <Label htmlFor="case" className="text-sm font-medium">
            Assigned Case *
          </Label>
          <Select
            value={caseId}
            onValueChange={(value) => {
              setCaseId(value);
              setTouched((prev) => new Set(prev).add('caseId'));
              if (value) {
                setValidationErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.caseId;
                  return newErrors;
                });
              }
            }}
          >
            <SelectTrigger
              className={`w-full ${touched.has('caseId') && validationErrors.caseId ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Select a case" />
            </SelectTrigger>
            <SelectContent>
              {cases?.map((caseItem: { id: string; title: string }) => (
                <SelectItem key={caseItem.id} value={caseItem.id}>
                  {caseItem.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.has('caseId') && validationErrors.caseId && (
            <p className="text-sm text-red-600">{validationErrors.caseId}</p>
          )}
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
            disabled={createTask.isPending}
            className="bg-[#00848b] hover:bg-[#006d73] text-white"
          >
            {createTask.isPending ? 'Creating...' : 'Create Task'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>

        {createTask.isError && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded border border-red-200">
            Failed to create task. Please ensure all required fields are filled correctly.
          </div>
        )}
      </form>
    </div>
  );
}

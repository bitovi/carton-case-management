import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type TaskPriority, TASK_PRIORITY_OPTIONS } from '@carton/shared/client';

type ValidationErrors = {
  title?: string;
  description?: string;
};

export function CreateTaskPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [caseId, setCaseId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const { data: cases } = trpc.case.list.useQuery();
  const { data: users } = trpc.user.list.useQuery();
  const createTask = trpc.task.create.useMutation({
    onSuccess: (data) => {
      utils.task.list.invalidate();
      navigate(`/tasks/${data.id}`);
    },
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!title.trim()) {
      errors.title = 'Task title is required';
    }

    if (!description.trim()) {
      errors.description = 'Task description is required';
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

    setTouched(new Set(['title', 'description']));

    if (!validateForm()) {
      return;
    }

    createTask.mutate({
      title,
      description,
      assignedTo: assignedTo || undefined,
      caseId: caseId || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Task Title *
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (touched.has('title')) validateForm();
            }}
            onBlur={() => handleBlur('title')}
            placeholder="Enter task title"
            className={touched.has('title') && validationErrors.title ? 'border-red-500' : ''}
          />
          {touched.has('title') && validationErrors.title && (
            <p className="text-sm text-red-600">{validationErrors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Task Description *
          </label>
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
          <label htmlFor="priority" className="text-sm font-medium">
            Priority *
          </label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as TaskPriority)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...TASK_PRIORITY_OPTIONS].map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date (Optional)
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full"
          />
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
              {users?.map((user: { id: string; name: string }) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="caseId" className="text-sm font-medium">
            Assign to Case (Optional)
          </label>
          <Select
            value={caseId || '__EMPTY__'}
            onValueChange={(value) => setCaseId(value === '__EMPTY__' ? '' : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__EMPTY__">No case</SelectItem>
              {cases?.map((caseItem: { id: string; title: string }) => (
                <SelectItem key={caseItem.id} value={caseItem.id}>
                  {caseItem.title}
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

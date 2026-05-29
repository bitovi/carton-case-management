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
import { Label } from '@/components/obra/Label';
import { TASK_PRIORITY_OPTIONS, type TaskPriority } from '@carton/shared/client';

export function CreateTaskPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [caseId, setCaseId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const { data: users } = trpc.user.list.useQuery();
  const { data: cases } = trpc.case.list.useQuery();
  const { data: currentUser } = trpc.auth.me.useQuery();

  const canSubmit = Boolean(title.trim() && description.trim());

  const createTask = trpc.task.create.useMutation({
    onSuccess: (data) => {
      utils.task.list.invalidate();
      utils.case.getById.invalidate({ id: data.caseId });
      navigate(`/tasks/${data.id}`);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmit || !caseId || !currentUser) {
      return;
    }

    createTask.mutate({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(`${dueDate}T00:00:00`) : undefined,
      caseId,
      assignedTo: assignedTo || undefined,
      createdBy: currentUser.id,
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 h-full flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Task Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Task Description *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm font-medium">
            Priority
          </Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
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
          <Label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </Label>
          <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo" className="text-sm font-medium">
            Assigned Employee
          </Label>
          <Select
            value={assignedTo || '__EMPTY__'}
            onValueChange={(value) => setAssignedTo(value === '__EMPTY__' ? '' : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__EMPTY__">Unassigned</SelectItem>
              {(users || []).map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caseId" className="text-sm font-medium">
            Assigned Case
          </Label>
          <Select value={caseId} onValueChange={setCaseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a case" />
            </SelectTrigger>
            <SelectContent>
              {(cases || []).map((caseItem) => (
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
            disabled={!canSubmit || !caseId || !currentUser || createTask.isPending}
            className="bg-[#00848b] hover:bg-[#006d73] text-white"
          >
            {createTask.isPending ? 'Creating...' : 'Create Task'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

import { EditableSelect, type EditableSelectOption } from '../EditableSelect';

interface EditablePriorityProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  isLoading?: boolean;
}

const PRIORITY_OPTIONS: EditableSelectOption[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export function EditablePriority({
  value,
  onSave,
  className = '',
  isLoading = false,
}: EditablePriorityProps) {
  return (
    <EditableSelect
      value={value}
      options={PRIORITY_OPTIONS}
      onChange={onSave}
      disabled={isLoading}
      displayClassName={className}
    />
  );
}

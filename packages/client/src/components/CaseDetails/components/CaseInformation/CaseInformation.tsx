import { useState, useMemo } from 'react';
import { List } from 'lucide-react';
import { type Descendant } from 'slate';
import { trpc } from '@/lib/trpc';
import { Button } from '@/ui/button';
import { StatusDropdown } from '../../../StatusDropdown';
import { RichTextEditor } from '../../../RichText/RichTextEditor';
import { RichTextRenderer } from '../../../RichText/RichTextRenderer';
import { serializeToJSON, deserializeFromJSON } from '../../../RichText/utils/serialization';
import type { CaseInformationProps } from './types';

export function CaseInformation({ caseId, caseData, onMenuClick }: CaseInformationProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Parse the description from JSON string to Slate document
  const initialValue = useMemo(
    () => deserializeFromJSON(caseData.description),
    [caseData.description]
  );
  const [editedDescription, setEditedDescription] = useState<Descendant[]>(initialValue);

  const utils = trpc.useUtils();
  const updateCase = trpc.case.update.useMutation({
    onSuccess: () => {
      // Invalidate queries to refetch the updated data
      utils.case.getById.invalidate({ id: caseId });
      utils.case.list.invalidate();
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to update case description:', error);
      alert(`Failed to save changes: ${error.message}`);
    },
  });

  const handleSave = () => {
    // Serialize the Slate document to JSON string
    const jsonDescription = serializeToJSON(editedDescription);

    updateCase.mutate({
      id: caseId,
      description: jsonDescription,
    });
  };

  const handleCancel = () => {
    setEditedDescription(initialValue);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile: Menu button + Title */}
      <div className="flex items-start gap-4 lg:hidden w-full">
        <Button
          onClick={onMenuClick}
          variant="outline"
          size="icon"
          className="flex-shrink-0 w-9 h-9 bg-[#e8feff] border-gray-300 shadow-sm hover:bg-[#bcecef]"
          aria-label="Open case list"
        >
          <List size={16} className="text-gray-700" />
        </Button>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h1 className="text-xl font-semibold truncate">{caseData.title}</h1>
          <p className="text-base font-semibold text-gray-600">#{caseData.caseNumber}</p>
        </div>
      </div>

      {/* Mobile: Status Badge */}
      <div className="lg:hidden self-start">
        <StatusDropdown caseId={caseId} currentStatus={caseData.status} />
      </div>

      {/* Desktop: Title + Status on same line */}
      <div className="hidden lg:flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h1 className="text-3xl font-semibold">{caseData.title}</h1>
          <p className="text-xl text-gray-600">#{caseData.caseNumber}</p>
        </div>
        <StatusDropdown caseId={caseId} currentStatus={caseData.status} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Case Description</h2>

        {!isEditing ? (
          <div
            className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <RichTextRenderer value={initialValue} />
          </div>
        ) : (
          <div className="flex flex-col">
            <RichTextEditor
              value={editedDescription}
              onChange={setEditedDescription}
              autoFocus
              onSave={handleSave}
              className="min-h-[76px]"
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSave}
                disabled={updateCase.isPending}
                className="bg-[#00848b] text-white hover:bg-[#006b72]"
              >
                {updateCase.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={updateCase.isPending}
                variant="outline"
                className="text-[#4c5b5c]"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

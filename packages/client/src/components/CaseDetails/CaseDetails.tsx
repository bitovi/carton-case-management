import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { CaseInformation } from './components/CaseInformation';
import { CaseComments } from './components/CaseComments';
import { CaseEssentialDetails } from './components/CaseEssentialDetails';
import { RelationshipManagerAccordion } from '@/components/common';
import { TASK_STATUS_OPTIONS } from '@carton/shared/client';

export function CaseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: caseData, isLoading } = trpc.case.getById.useQuery({ id: id! }, { enabled: !!id });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-2"></div>
          <p>Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">No case selected</p>
          <p className="text-sm">Select a case from the list or create a new one to get started</p>
        </div>
      </div>
    );
  }

  const statusLabel = (status: string) =>
    TASK_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;

  const relatedTaskItems = (caseData.tasks ?? []).map((task) => ({
    id: task.id,
    title: task.summary,
    subtitle: statusLabel(task.status),
    to: `/tasks/${task.id}`,
  }));

  const handleAddTask = () => {
    navigate(`/tasks/new?caseId=${caseData.id}`);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Mobile Layout */}
      <div className="flex flex-col w-full lg:hidden gap-4 pb-6">
        <CaseInformation caseId={caseData.id} caseData={caseData} />
        <CaseEssentialDetails caseId={caseData.id} caseData={caseData} />
        <RelationshipManagerAccordion
          accordionTitle="Related Tasks"
          items={relatedTaskItems}
          defaultOpen={true}
          onAddClick={handleAddTask}
        />
        <CaseComments caseData={caseData} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 gap-4">
        <div className="flex flex-col px-1 flex-1 gap-6">
          <CaseInformation caseId={caseData.id} caseData={caseData} />
          <div className="h-[9px]" />
          <CaseComments caseData={caseData} />
        </div>
        <div className="h-[9px]" />
        <div className="flex flex-col gap-4">
          <CaseEssentialDetails caseId={caseData.id} caseData={caseData} />
          <RelationshipManagerAccordion
            accordionTitle="Related Tasks"
            items={relatedTaskItems}
            defaultOpen={true}
            onAddClick={handleAddTask}
          />
        </div>
      </div>
    </div>
  );
}

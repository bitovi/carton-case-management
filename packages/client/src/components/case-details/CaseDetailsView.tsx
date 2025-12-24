import { CaseHeader } from './CaseHeader';
import { CaseDescription } from './CaseDescription';
import { CommentsList, type Comment } from './CommentsList';
import { EssentialDetailsPanel } from './EssentialDetailsPanel';

export interface CaseDetailsViewProps {
  caseData: {
    id: string;
    title: string;
    description: string;
    status: string;
    caseType: string;
    customerName: string;
    createdAt: Date;
    updatedAt: Date;
    creator: {
      id: string;
      name: string;
      email: string;
    };
    assignee?: {
      id: string;
      name: string;
      email: string;
    };
    comments: Comment[];
  };
}

export function CaseDetailsView({ caseData }: CaseDetailsViewProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <CaseHeader
              caseId={caseData.title}
              title={caseData.title}
              caseType={caseData.caseType}
              status={caseData.status}
              customerName={caseData.customerName}
              createdAt={caseData.createdAt}
              updatedAt={caseData.updatedAt}
            />
            <div className="mt-6">
              <CaseDescription description={caseData.description} />
            </div>
            <div className="mt-6">
              <CommentsList comments={caseData.comments} />
            </div>
          </div>
        </div>

        {/* Right sidebar for essential details */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-auto">
          <div className="p-6">
            <EssentialDetailsPanel
              status={caseData.status}
              creator={caseData.creator}
              assignee={caseData.assignee}
              createdAt={caseData.createdAt}
              updatedAt={caseData.updatedAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

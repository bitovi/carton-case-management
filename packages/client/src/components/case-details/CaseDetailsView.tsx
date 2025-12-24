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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <CaseHeader
              caseId={caseData.title}
              title={caseData.title}
              caseType={caseData.caseType}
              status={caseData.status}
              customerName={caseData.customerName}
              createdAt={caseData.createdAt}
              updatedAt={caseData.updatedAt}
            />
            <CaseDescription description={caseData.description} />
            <CommentsList comments={caseData.comments} />
          </div>

          {/* Sidebar - 1 column on large screens */}
          <div className="lg:col-span-1">
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

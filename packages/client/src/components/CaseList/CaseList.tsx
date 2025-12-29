import { Link } from 'react-router-dom';
import { trpc } from '@/lib/trpc';

export function CaseList() {
  const { data: cases, isLoading } = trpc.case.list.useQuery();

  if (isLoading) {
    return <div>Loading cases...</div>;
  }

  return (
    <div>
      <h2>Cases</h2>
      <ul>
        {cases?.map((caseItem) => (
          <li key={caseItem.id}>
            <Link to={`/cases/${caseItem.id}`}>{caseItem.caseNumber}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

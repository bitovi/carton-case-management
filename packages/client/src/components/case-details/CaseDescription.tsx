import { Card } from '../ui/card';

export interface CaseDescriptionProps {
  description: string;
}

export function CaseDescription({ description }: CaseDescriptionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
    </Card>
  );
}

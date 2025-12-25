export interface CaseDescriptionProps {
  description: string;
}

export function CaseDescription({ description }: CaseDescriptionProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
    </div>
  );
}

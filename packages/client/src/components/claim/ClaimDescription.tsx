interface ClaimDescriptionProps {
  description: string;
}

export function ClaimDescription({ description }: ClaimDescriptionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
    </div>
  );
}

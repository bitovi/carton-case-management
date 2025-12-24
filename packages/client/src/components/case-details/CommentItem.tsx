export interface CommentItemProps {
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
}

export function CommentItem({ content, authorName, authorEmail, createdAt }: CommentItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
          {getInitials(authorName)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-gray-900">{authorName}</span>
          <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

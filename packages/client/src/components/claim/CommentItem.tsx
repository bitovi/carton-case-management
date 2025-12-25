import { formatTimestamp } from '../../lib/utils/date';
import { getInitials, getAvatarColor } from '../../lib/utils/avatar';

interface CommentItemProps {
  content: string;
  authorName: string;
  createdAt: Date | string;
}

export function CommentItem({ content, authorName, createdAt }: CommentItemProps) {
  const initials = getInitials(authorName);
  const avatarColor = getAvatarColor(authorName);

  return (
    <div className="flex gap-3 py-4 border-b border-gray-200 last:border-b-0">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-gray-700`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-gray-900">{authorName}</span>
          <span className="text-xs text-gray-500">{formatTimestamp(createdAt)}</span>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { CommentReactionsProps, ReactionType } from './types';

export function CommentReactions({
  reactions,
  currentUserId,
  onReact,
  disabled = false,
}: CommentReactionsProps) {
  const likeCount = reactions.filter((r) => r.type === 'LIKE').length;
  const dislikeCount = reactions.filter((r) => r.type === 'DISLIKE').length;
  const currentUserReaction = currentUserId
    ? reactions.find((r) => r.userId === currentUserId)?.type
    : undefined;

  const buttonBase =
    'flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const inactive = 'text-gray-500 hover:bg-gray-100';
  const activeLike = 'bg-blue-50 text-blue-600';
  const activeDislike = 'bg-red-50 text-red-600';

  const renderButton = (type: ReactionType, count: number) => {
    const isActive = currentUserReaction === type;
    const Icon = type === 'LIKE' ? ThumbsUp : ThumbsDown;
    const activeClass = type === 'LIKE' ? activeLike : activeDislike;
    const label = type === 'LIKE' ? 'Like comment' : 'Dislike comment';
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={isActive}
        disabled={disabled || !currentUserId}
        onClick={() => onReact(type)}
        className={`${buttonBase} ${isActive ? activeClass : inactive}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{count}</span>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {renderButton('LIKE', likeCount)}
      {renderButton('DISLIKE', dislikeCount)}
    </div>
  );
}

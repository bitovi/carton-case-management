# useReaction Hook

A custom React hook for managing reactions (likes/dislikes) on cases and comments using optimistic updates and tRPC integration.

## Features

- **Optimistic Updates**: UI updates immediately before server confirmation
- **Automatic Rollback**: Reverts to previous state on error
- **Smart State Management**: Handles toggle and switch behaviors correctly
- **Type-Safe**: Full TypeScript support with tRPC integration
- **Batch Query Support**: Efficient loading of reactions for multiple entities

## Usage

### Basic Example

```tsx
import { useReaction } from '@/hooks/useReaction';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';

function CaseCard({ caseId }: { caseId: string }) {
  const {
    upvotes,
    downvotes,
    upvoters,
    downvoters,
    userVote,
    toggleUpvote,
    toggleDownvote,
    isLoading,
  } = useReaction({
    entityType: 'CASE',
    entityId: caseId,
  });

  if (isLoading) {
    return <div>Loading reactions...</div>;
  }

  return (
    <ReactionStatistics
      userVote={userVote}
      upvotes={upvotes}
      downvotes={downvotes}
      upvoters={upvoters}
      downvoters={downvoters}
      onUpvote={toggleUpvote}
      onDownvote={toggleDownvote}
    />
  );
}
```

### With Comments

```tsx
function CommentItem({ commentId }: { commentId: string }) {
  const { upvotes, downvotes, userVote, toggleUpvote, toggleDownvote } = useReaction({
    entityType: 'COMMENT',
    entityId: commentId,
  });

  return (
    <div>
      <p>Comment content...</p>
      <ReactionStatistics
        userVote={userVote}
        upvotes={upvotes}
        downvotes={downvotes}
        onUpvote={toggleUpvote}
        onDownvote={toggleDownvote}
      />
    </div>
  );
}
```

## API

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `entityType` | `'CASE' \| 'COMMENT'` | Type of entity to react to |
| `entityId` | `string` | ID of the entity |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `upvotes` | `number` | Number of upvotes |
| `downvotes` | `number` | Number of downvotes |
| `upvoters` | `string[]` | Array of upvoter names |
| `downvoters` | `string[]` | Array of downvoter names |
| `userVote` | `'up' \| 'down' \| 'none'` | Current user's vote state |
| `toggleUpvote` | `() => void` | Function to toggle upvote |
| `toggleDownvote` | `() => void` | Function to toggle downvote |
| `isLoading` | `boolean` | Whether data is loading |
| `isMutating` | `boolean` | Whether a mutation is in progress |

## Behavior

### Toggle Behavior
- **Click active button**: Removes the vote (toggle off)
- **Click inactive button**: Adds the vote

### Switch Behavior
- **Click opposite button**: Switches the vote from up to down or vice versa

### Optimistic Updates
1. UI updates immediately when user clicks
2. Request sent to server
3. On success: Server confirms the change
4. On error: UI reverts to previous state

## Related Components

- **ReactionStatistics**: Display component for reaction buttons
- **VoteButton**: Individual vote button component
- **VoterTooltip**: Tooltip showing voter names

## Backend Integration

This hook integrates with the following tRPC procedures:

- `reaction.getByEntity`: Fetch reaction statistics for an entity
- `reaction.toggle`: Toggle a reaction (create, update, or delete)

## Testing

Tests are located in `useReaction.test.ts` and cover:
- Initial state
- Data loading
- Toggle upvote/downvote
- Mutation pending state

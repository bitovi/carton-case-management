import { Link, useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/obra/Skeleton';
import { Button } from '@/components/obra/Button';
import type { UserListProps } from './types';

export function UserList({ onUserClick }: UserListProps) {
  const { id: activeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: users, isLoading, error, refetch } = trpc.user.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col w-full lg:w-[200px]">
        <Button
          onClick={() => navigate('/users/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create New User
        </Button>
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg">
              <Skeleton className="h-5 bg-slate-200 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/users/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create New User
        </Button>
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading users</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} size="small">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/users/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create New User
        </Button>
        <div className="text-center text-gray-500">
          <p className="text-sm">No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full lg:w-[200px]">
      <Button
        onClick={() => navigate('/users/new')}
        variant="secondary"
        className="w-full mb-2"
      >
        Create New User
      </Button>
      <div className="flex flex-col gap-2">
        {users?.map((user: { id: string; firstName: string; lastName: string }) => {
          const isActive = user.id === activeId;
          return (
            <Link
              key={user.id}
              to={`/users/${user.id}`}
              onClick={onUserClick}
              className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-[#e8feff]' : 'hover:bg-gray-100'
              }`}
            >
              <p className="text-sm font-medium text-[#00848b] w-full truncate">{user.firstName} {user.lastName}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { UserList } from '@/components/UserList';
import { UserDetails } from '@/components/UserDetails';
import { CreateUserPage } from '@/pages/CreateUserPage';

export function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: users } = trpc.user.list.useQuery();

  useEffect(() => {
    // On desktop, if we're on /users/ without an ID and we have users, redirect to first user
    // On mobile, we want to show the list first, so don't auto-redirect
    if (!id && users && users.length > 0 && location.pathname === '/users/') {
      if (window.innerWidth >= 1024) {
        navigate(`/users/${users[0].id}`, { replace: true });
      }
    }
  }, [id, users, navigate, location.pathname]);

  return (
    <div className="flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm h-full lg:p-6 p-4">
      <div className="hidden lg:block">
        <UserList />
      </div>

      {id === 'new' ? (
        <CreateUserPage />
      ) : id ? (
        <UserDetails />
      ) : (
        <div className="flex-1 lg:hidden">
          <UserList />
        </div>
      )}
    </div>
  );
}

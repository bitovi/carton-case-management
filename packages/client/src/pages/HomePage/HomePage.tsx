import { Link } from 'react-router-dom';
import { ArrowRight, Bot, FolderClosed, Users } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Card, Skeleton } from '@/components/obra';

const SECTIONS = [
  {
    to: '/cases/',
    label: 'Cases',
    icon: FolderClosed,
    description: 'Track, update, and resolve customer cases.',
  },
  {
    to: '/users/',
    label: 'Users',
    icon: Bot,
    description: 'Manage the team members cases are assigned to.',
  },
  {
    to: '/customers/',
    label: 'Customers',
    icon: Users,
    description: 'Browse customer records and their case history.',
  },
] as const;

export function HomePage() {
  const { data: user } = trpc.auth.me.useQuery();
  const caseList = trpc.case.list.useQuery();
  const userList = trpc.user.list.useQuery();
  const customerList = trpc.customer.list.useQuery();

  const counts: Record<string, { total?: number; isLoading: boolean }> = {
    Cases: { total: caseList.data?.length, isLoading: caseList.isLoading },
    Users: { total: userList.data?.length, isLoading: userList.isLoading },
    Customers: { total: customerList.data?.length, isLoading: customerList.isLoading },
  };

  return (
    <div className="w-full bg-gray-50 lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4">
      <div className="max-w-5xl">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          {user ? `Welcome back, ${user.firstName}` : 'Welcome'}
        </h1>
        <p className="mt-2 text-gray-600">
          Choose a section below to get started.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map(({ to, label, icon: Icon, description }) => {
            const { total, isLoading } = counts[label];

            return (
              <Link
                key={to}
                to={to}
                aria-label={`Go to ${label}`}
                className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <Card
                  className="h-full transition-shadow group-hover:shadow-md"
                  header={
                    <div className="flex items-center justify-between text-gray-900">
                      <span className="flex items-center gap-2 font-medium">
                        <Icon size={20} aria-hidden="true" />
                        {label}
                      </span>
                      {isLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        <span className="text-2xl font-semibold text-teal-700">{total ?? 0}</span>
                      )}
                    </div>
                  }
                  main={<p className="text-sm text-gray-600">{description}</p>}
                  footer={
                    <span className="flex items-center gap-1 text-sm font-medium text-teal-700">
                      View {label}
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  }
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

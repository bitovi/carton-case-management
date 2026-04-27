import { useNavigate } from 'react-router-dom';
import { FolderClosed, Users, Bot, ArrowRight, Package } from 'lucide-react';

const features = [
  {
    icon: <FolderClosed size={20} />,
    iconBg: 'bg-[--teal-100] text-[--teal-700]',
    title: 'Case Management',
    description:
      'Track, prioritise, and resolve support cases end-to-end. Full history, status updates, and team assignment in one place.',
    path: '/cases/',
  },
  {
    icon: <Users size={20} />,
    iconBg: 'bg-[--orange-100] text-[--orange-600]',
    title: 'Customer Profiles',
    description:
      'Centralise customer information and link every case back to the right customer for a complete picture of every relationship.',
    path: '/customers/',
  },
  {
    icon: <Bot size={20} />,
    iconBg: 'bg-[--green-100] text-[--green-700]',
    title: 'Team Collaboration',
    description:
      'Assign agents, manage workloads, and keep your whole support team aligned without switching between tools.',
    path: '/users/',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-8 h-full flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-4 pt-6">
          <div className="w-14 h-14 rounded-xl bg-[--teal-800] flex items-center justify-center shadow-md">
            <Package size={28} color="white" strokeWidth={2.5} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-[--gray-900] tracking-tight">
              Welcome to <span className="text-[--teal-700]">Carton</span>
            </h1>
            <p className="text-lg text-[--gray-600] max-w-md">
              A single, clear workspace to manage customer cases from first contact to resolution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => navigate('/cases/')}
              className="inline-flex items-center gap-2 bg-[--teal-700] hover:bg-[--teal-600] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Open Cases <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/customers/')}
              className="inline-flex items-center gap-2 border border-[--gray-300] hover:border-[--gray-400] text-[--gray-700] font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              View Customers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="flex flex-col gap-3 p-5 rounded-lg border border-[--gray-200] bg-[--gray-50] hover:border-[--teal-400] hover:bg-[--teal-50] transition-colors text-left cursor-pointer"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${feature.iconBg}`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-[--gray-900]">{feature.title}</h3>
              <p className="text-sm text-[--gray-600] leading-relaxed">{feature.description}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-[--gray-400] pb-4">
          &copy; {new Date().getFullYear()} Carton — Case Management Platform
        </p>
      </div>
    </div>
  );
}

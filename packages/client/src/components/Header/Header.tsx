import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CartonLogoSvg from '@/assets/carton-logo.svg';
import type { HeaderProps } from './types';

function CartonLogo({ size = 34 }: { size?: number }) {
  return <img src={CartonLogoSvg} alt="Carton Case Management" width={size} height={size} />;
}

export function Header({ className, userInitials = 'AM', onAvatarClick }: HeaderProps) {
  return (
    <header
      className={`w-full bg-[#002a2d] flex items-center justify-between px-6 py-4 ${className || ''}`}
      aria-label="Main navigation"
    >
      <Link
        to="/"
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--header-bg))] rounded-md"
        aria-label="Navigate to home"
      >
        <CartonLogo />
        <span className="text-white text-xl font-semibold">
          Carton<span className="hidden lg:inline"> Case Management</span>
        </span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--header-bg))]"
          aria-label="User menu"
          onClick={onAvatarClick}
        >
          {userInitials}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="p-2 text-sm text-gray-500">No menu items yet</div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

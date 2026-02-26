import { Link } from 'react-router-dom';
import { MoreOptionsMenu, MenuItem } from '@/components/common/MoreOptionsMenu';
import { Button } from '@/components/obra/Button';
import EggbertImage from './eggbert.png';
import type { HeaderProps } from './types';

function CartonLogo({ size = 34 }: { size?: number }) {
  return <img src={EggbertImage} alt="Eggbert's Automaton Outlet" width={size} height={size} />;
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
          Eggbert's<span className="hidden lg:inline"> Automaton Outlet</span>
        </span>
      </Link>

      <MoreOptionsMenu
        trigger={
          <Button
            variant="ghost"
            size="mini"
            roundness="round"
            className="w-10 h-10 bg-white text-gray-900 hover:bg-gray-100 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--header-bg))]"
            aria-label="User menu"
            onClick={onAvatarClick}
          >
            {userInitials}
          </Button>
        }
        align="end"
      >
        <MenuItem>No menu items yet</MenuItem>
      </MoreOptionsMenu>
    </header>
  );
}

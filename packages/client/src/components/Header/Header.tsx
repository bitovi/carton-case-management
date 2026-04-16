import { Link } from 'react-router-dom';
import { MoreOptionsMenu, MenuItem } from '@/components/common/MoreOptionsMenu';
import { Button } from '@/components/obra/Button';
import CartonLogoSvg from '@/assets/carton-logo.svg';
import type { HeaderProps } from './types';

function CartonLogo({ size = 34 }: { size?: number }) {
  return <img src={CartonLogoSvg} alt="Manuel Pages!" width={size} height={size} />;
}

export function Header({ className, userInitials = 'AM', onAvatarClick }: HeaderProps) {
  return (
    <header
      className={`w-full bg-[hsl(var(--header-bg))] flex items-center justify-between px-6 py-4 ${className || ''}`}
      aria-label="Main navigation"
    >
      <Link
        to="/"
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--header-bg))] rounded-md"
        aria-label="Navigate to home"
      >
        <CartonLogo />
        <span className="text-white text-xl font-semibold">Manuel Pages!</span>
      </Link>

      <MoreOptionsMenu
        trigger={
          <Button
            variant="ghost"
            size="mini"
            roundness="round"
            className="w-10 h-10 bg-accent text-accent-foreground hover:bg-accent-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--header-bg))]"
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

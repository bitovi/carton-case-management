import figma from '@figma/code-connect';
import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';
import { Trash2 } from 'lucide-react';

// Connect to main Carton Case Management designs
figma.connect(
  MoreOptionsMenu,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1179-62911&m=dev',
  {
  example: () => (
    <MoreOptionsMenu>
        <MenuItem icon={<Trash2 />}>Delete</MenuItem>
    </MoreOptionsMenu>
  ),
}
);

// Connect to Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  MoreOptionsMenu,
  'https://www.figma.com/design/zm8VZCEsJFFxJOiSC1HtUt/Riot-Games-App-Design?node-id=1179-62911',
  {
  example: () => (
    <MoreOptionsMenu>
        <MenuItem icon={<Trash2 />}>Delete</MenuItem>
    </MoreOptionsMenu>
  ),
}
);


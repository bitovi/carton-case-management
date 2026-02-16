import figma from '@figma/code-connect';
import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';
import { Trash2 } from 'lucide-react';

const moreOptionsMenuConfig = {
  example: () => (
    <MoreOptionsMenu>
        <MenuItem icon={<Trash2 />}>Delete</MenuItem>
    </MoreOptionsMenu>
  ),
};

// Connect to main Carton Case Management designs
figma.connect(
  MoreOptionsMenu,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1179-62911&m=dev',
  { ...moreOptionsMenuConfig }
);

// Connect to Riot Training version
figma.connect(
  MoreOptionsMenu,
  'https://www.figma.com/design/7W0r8XwvVXzGSOJhvV9c3o/App-Design?node-id=1179-62911',
  { ...moreOptionsMenuConfig }
);



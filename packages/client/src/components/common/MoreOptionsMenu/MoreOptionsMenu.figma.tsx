import figma from '@figma/code-connect';
import { SvgIcon } from '@progress/kendo-react-common';
import { trashIcon } from '@progress/kendo-svg-icons';
import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';

const moreOptionsMenuConfig = {
  example: () => (
    <MoreOptionsMenu>
      <MenuItem icon={<SvgIcon icon={trashIcon} size="small" />}>Delete</MenuItem>
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

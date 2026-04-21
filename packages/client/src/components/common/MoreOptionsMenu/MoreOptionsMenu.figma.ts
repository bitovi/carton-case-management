// url=https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1179-62911&m=dev
// component=MoreOptionsMenu

import figma from "figma"

export default {
  id: "MoreOptionsMenu",
  imports: [
    "import { MoreOptionsMenu, MenuItem } from './MoreOptionsMenu';",
    "import { Trash2 } from 'lucide-react';",
  ],
  example: figma.code`<MoreOptionsMenu>
        <MenuItem icon={<Trash2 />}>Delete</MenuItem>
    </MoreOptionsMenu>`,
}

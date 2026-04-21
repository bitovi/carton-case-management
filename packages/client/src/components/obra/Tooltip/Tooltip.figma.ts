// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=133:14788
// component=Tooltip

import figma from "figma"

const side = figma.selectedInstance.getEnum("Side", {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
})

export default {
  id: "Tooltip",
  imports: [
    "import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './index';",
  ],
  example: figma.code`<TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent side="${side}">
          Tooltip text
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>`,
  metadata: { nestable: true },
}

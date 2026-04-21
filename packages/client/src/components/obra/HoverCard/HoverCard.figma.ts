// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246487
// component=HoverCard

import figma from "figma"

const children = figma.properties.children([".Slot Inner"])

export default {
  id: "HoverCard",
  imports: ["import { HoverCard } from './HoverCard';"],
  example: figma.code`<HoverCard trigger={<button>Hover trigger</button>}>
      ${figma.helpers.react.renderChildren(children)}
    </HoverCard>`,
  metadata: { nestable: true },
}

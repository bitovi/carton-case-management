// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6979
// component=Badge

import figma from "figma"

const variant = figma.selectedInstance.getEnum("Variant", {
  Primary: "primary",
  Secondary: "secondary",
  Outline: "outline",
  Ghost: "ghost",
  Destructive: "destructive",
})
const roundness = figma.selectedInstance.getEnum("Roundness", {
  Default: "default",
  Round: "round",
})
const children = (figma.selectedInstance.findText("Label") as { textContent: string })?.textContent
const iconLeft = figma.selectedInstance.getBoolean("Show icon left", {
  true: figma.selectedInstance.getInstanceSwap("⮑ Icon left")?.executeTemplate()
    .example,
  false: undefined,
})
const iconRight = figma.selectedInstance.getBoolean("Show icon right", {
  true: figma.selectedInstance
    .getInstanceSwap("⮑ Icon right")
    ?.executeTemplate().example,
  false: undefined,
})

export default {
  id: "Badge",
  imports: ["import { Badge } from './Badge';"],
  example: figma.code`<Badge variant="${variant}" roundness="${roundness}"${figma.helpers.react.renderProp("iconLeft", iconLeft)}${figma.helpers.react.renderProp("iconRight", iconRight)}>
        ${children}
      </Badge>`,
  metadata: { nestable: true },
}

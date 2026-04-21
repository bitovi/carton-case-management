// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=9:1071
// component=Button

import figma from "figma"

const variant = figma.selectedInstance.getEnum("Variant", {
  Primary: "primary",
  Secondary: "secondary",
  Outline: "outline",
  Ghost: "ghost",
  "Ghost Muted": "ghost-muted",
  Destructive: "destructive",
})
const size = figma.selectedInstance.getEnum("Size", {
  Large: "large",
  Regular: "regular",
  Small: "small",
  Mini: "mini",
})
const roundness = figma.selectedInstance.getEnum("Roundness", {
  Default: "default",
  Round: "round",
})
const disabled = figma.selectedInstance.getEnum("State", {
  Disabled: true,
})
const children = (figma.selectedInstance.findText("Label") as { textContent: string })?.textContent
const leftIcon = figma.selectedInstance.getBoolean("Show left icon", {
  true: figma.selectedInstance.getInstanceSwap("⮑ Left icon")?.executeTemplate()
    .example,
  false: undefined,
})
const rightIcon = figma.selectedInstance.getBoolean("Show right icon", {
  true: figma.selectedInstance
    .getInstanceSwap("⮑ Right icon")
    ?.executeTemplate().example,
  false: undefined,
})

export default {
  id: "Button",
  imports: ["import { Button } from './Button';"],
  example: figma.code`<Button variant="${variant}" size="${size}" roundness="${roundness}"${figma.helpers.react.renderProp("disabled", disabled)}${figma.helpers.react.renderProp("leftIcon", leftIcon)}${figma.helpers.react.renderProp("rightIcon", rightIcon)}>
      ${children}
    </Button>`,
  metadata: { nestable: true },
}

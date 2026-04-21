// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1738&m=dev
// component=Input

import figma from "figma"

const size = figma.selectedInstance.getEnum("Size", {
  Mini: "mini",
  Small: "small",
  Regular: "regular",
  Large: "large",
})
const roundness = figma.selectedInstance.getEnum("Roundness", {
  Default: "default",
  Round: "round",
})
const error = figma.selectedInstance.getEnum("State", {
  Error: true,
  "Error Focus": true,
})
const disabled = figma.selectedInstance.getEnum("State", {
  Disabled: true,
})
const placeholder = figma.selectedInstance.getEnum("State", {
  Empty: "",
  Placeholder: (figma.selectedInstance.findText("Placeholder text") as { textContent: string })?.textContent,
})

export default {
  id: "Input",
  imports: ["import { Input } from './Input';"],
  example: figma.code`<Input size="${size}" roundness="${roundness}"${figma.helpers.react.renderProp("error", error)}${figma.helpers.react.renderProp("disabled", disabled)}${figma.helpers.react.renderProp("placeholder", placeholder)}/>`,

  metadata: { nestable: true },
}

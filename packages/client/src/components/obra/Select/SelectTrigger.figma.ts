// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1732
// component=SelectTrigger

import figma from "figma"

const size = figma.selectedInstance.getEnum("Size", {
  Mini: "mini",
  Small: "small",
  Regular: "regular",
  Large: "large",
})
const layout = figma.selectedInstance.getEnum("Lines", {
  "1 Line": "single",
  "2 Lines": "stacked",
})
const error = figma.selectedInstance.getEnum("State", {
  Error: true,
})
const disabled = figma.selectedInstance.getEnum("State", {
  Disabled: true,
})

export default {
  id: "SelectTrigger",
  imports: ["import { SelectTrigger } from './Select';"],
  example: figma.code`<SelectTrigger size="${size}" layout="${layout}"${figma.helpers.react.renderProp("error", error)}${figma.helpers.react.renderProp("disabled", disabled)}/>`,

  metadata: { nestable: true },
}

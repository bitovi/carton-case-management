// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1745
// component=Textarea

import figma from "figma"

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
  Placeholder: "Type your message here.",
})
const defaultValue = figma.selectedInstance.getEnum("State", {
  Value: "Value",
  Focus: "Value",
  Error: "Value",
  "Error Focus": "Value",
  Disabled: "Value",
})

export default {
  id: "Textarea",
  imports: ["import { Textarea } from './Textarea';"],
  example: figma.code`<Textarea roundness="${roundness}"${figma.helpers.react.renderProp("error", error)}${figma.helpers.react.renderProp("disabled", disabled)}${figma.helpers.react.renderProp("placeholder", placeholder)} defaultValue="${defaultValue}"/>`,

  metadata: { nestable: true },
}

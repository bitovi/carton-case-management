// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=18-1010
// component=SelectItem

import figma from "figma"

const size = figma.selectedInstance.getEnum("Size", {
  Regular: "regular",
  Large: "large",
})
const type = figma.selectedInstance.getEnum("Type", {
  Default: "default",
  Destructive: "destructive",
})
const disabled = figma.selectedInstance.getEnum("State", {
  Disabled: true,
})

export default {
  id: "SelectItem",
  imports: ["import { SelectItem } from './Select';"],
  example: figma.code`<SelectItem value="value" size="${size}" type="${type}"${figma.helpers.react.renderProp("disabled", disabled)}>
        Item text
      </SelectItem>`,
  metadata: { nestable: true },
}

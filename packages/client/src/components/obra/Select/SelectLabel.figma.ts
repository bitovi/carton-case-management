// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=80-10189
// component=SelectLabel

import figma from "figma"

const size = figma.selectedInstance.getEnum("Type", {
  Small: "small",
  Regular: "regular",
})

export default {
  id: "SelectLabel",
  imports: ["import { SelectLabel } from './Select';"],
  example: figma.code`<SelectLabel size="${size}">
        Label text
      </SelectLabel>`,
  metadata: { nestable: true },
}

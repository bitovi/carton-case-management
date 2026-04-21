// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22344
// component=DialogHeader

import figma from "figma"

const type = figma.selectedInstance.getEnum("Type", {
  Header: "Header",
  "Close Only": "Close Only",
  "Icon Button Close": "Icon Button Close",
})

export default {
  id: "DialogHeader",
  imports: ["import { DialogHeader } from './DialogHeader';"],
  example: figma.code`<DialogHeader type="${type}"/>`,

  metadata: { nestable: true },
}

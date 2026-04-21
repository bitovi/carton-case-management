// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=103-9453&m=dev
// component=Label

import figma from "figma"

const layout = figma.selectedInstance.getEnum("Layout", {
  Inline: "inline",
  Block: "block",
})
const children = (figma.selectedInstance.findText("Label") as { textContent: string })?.textContent

export default {
  id: "Label",
  imports: ["import { Label } from './Label';"],
  example: figma.code`<Label layout="${layout}">
        ${children}
      </Label>`,
  metadata: { nestable: true },
}

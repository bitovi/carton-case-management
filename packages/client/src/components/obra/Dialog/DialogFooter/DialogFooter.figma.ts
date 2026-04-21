// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-21284
// component=DialogFooter

import figma from "figma"

const type = figma.selectedInstance.getEnum("Type", {
  "2 Buttons Right": "2 Buttons Right",
  "2 Full-width Buttons": "2 Full-width Buttons",
  "Single Full-width Button": "Single Full-width Button",
})
const children = figma.properties.children(["AL"])

export default {
  id: "DialogFooter",
  imports: ["import { DialogFooter } from './DialogFooter';"],
  example: figma.code`<DialogFooter type="${type}"${figma.helpers.react.renderProp("children", children)}/>`,

  metadata: { nestable: true },
}

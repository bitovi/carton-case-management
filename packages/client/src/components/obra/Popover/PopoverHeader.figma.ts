// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=2336-181
// component=PopoverHeader

import figma from "figma"

const title = (figma.selectedInstance.findText("2336:147") as { textContent: string })?.textContent
const description = (figma.selectedInstance.findText("2336:148") as { textContent: string })?.textContent

export default {
  id: "PopoverHeader",
  imports: ['import { PopoverHeader } from "./PopoverHeader";'],
  example: figma.code`<PopoverHeader title="${title}" description="${description}"/>`,

  metadata: { nestable: true },
}

// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=66-5041
// component=AccordionContent

import figma from "figma"

const children = figma.properties.children(["*"])

export default {
  id: "AccordionContent",
  imports: ["import { AccordionContent } from './AccordionContent';"],
  example: figma.code`<AccordionContent>${figma.helpers.react.renderChildren(
    children,
  )}</AccordionContent>`,
  metadata: { nestable: true },
}

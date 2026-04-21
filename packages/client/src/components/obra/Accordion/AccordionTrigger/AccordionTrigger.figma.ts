// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=66-5034
// component=AccordionTrigger

import figma from "figma"

const children = figma.properties.children(["*"])

export default {
  id: "AccordionTrigger",
  imports: ["import { AccordionTrigger } from './AccordionTrigger';"],
  example: figma.code`<AccordionTrigger>${figma.helpers.react.renderChildren(
    children,
  )}</AccordionTrigger>`,
  metadata: { nestable: true },
}

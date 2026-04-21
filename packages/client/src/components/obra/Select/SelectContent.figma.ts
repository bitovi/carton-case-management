// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-27848
// component=SelectContent

import figma from "figma"

const children = figma.properties.children(["*"])

export default {
  id: "SelectContent",
  imports: ["import { SelectContent } from './Select';"],
  example: figma.code`<SelectContent>
        ${figma.helpers.react.renderChildren(children)}
      </SelectContent>`,
  metadata: { nestable: true },
}

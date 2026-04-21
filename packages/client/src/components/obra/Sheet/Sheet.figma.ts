// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=301-243831
// component=Sheet

import figma from "figma"

const scrollable = figma.selectedInstance.getEnum("Scrollable", {
  True: true,
  False: false,
})

export default {
  id: "Sheet",
  imports: ["import { Sheet } from './Sheet';"],
  example: figma.code`<Sheet open={true} scrollable={${scrollable}} header="DialogHeader component" footer="DialogFooter component">
      Content goes here
    </Sheet>`,
  metadata: { nestable: true },
}

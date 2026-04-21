// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6351
// component=RichCheckboxGroup

import figma from "figma"

const checked = figma.selectedInstance.getEnum("Checked?", {
  False: false,
  True: true,
})
const flipped = figma.selectedInstance.getEnum("Flipped", {
  False: false,
  True: true,
})
const showLine2 = figma.selectedInstance.getBoolean("Show Line 2")

export default {
  id: "RichCheckboxGroup",
  imports: ["import { RichCheckboxGroup } from './RichCheckboxGroup';"],
  example: figma.code`<RichCheckboxGroup checked={${checked}} flipped={${flipped}} showLine2={${showLine2}} label="Label" secondaryText="Secondary text" onCheckedChange={() => { }}/>`,

  metadata: { nestable: true },
}

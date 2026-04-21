// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6040
// component=CheckboxGroup

import figma from "figma"

const layout = figma.selectedInstance.getEnum("Layout", {
  Inline: "inline",
  Block: "block",
})
const checked = figma.selectedInstance.getEnum("Checked?", {
  False: false,
  True: true,
})

export default {
  id: "CheckboxGroup",
  imports: ["import { CheckboxGroup } from './CheckboxGroup';"],
  example: figma.code`<CheckboxGroup layout="${layout}" checked={${checked}} label="Label" onCheckedChange={() => { }}/>`,

  metadata: { nestable: true },
}

// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1790
// component=Checkbox

import figma from "figma"

const checked = figma.selectedInstance.getEnum("Checked?", {
  False: false,
  True: true,
  Indeterminate: "indeterminate",
})
const error = figma.selectedInstance.getEnum("State", {
  Default: false,
  Focus: false,
  Error: true,
  "Error Focus": true,
  Disabled: false,
})
const disabled = figma.selectedInstance.getEnum("State", {
  Default: false,
  Focus: false,
  Error: false,
  "Error Focus": false,
  Disabled: true,
})

export default {
  id: "Checkbox",
  imports: ["import { Checkbox } from './Checkbox';"],
  example: figma.code`<Checkbox checked={${checked}} error={${error}} disabled={${disabled}}/>`,

  metadata: { nestable: true },
}

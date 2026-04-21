// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=58-5416
// component=Alert

import figma from "figma"

const type = figma.selectedInstance.getEnum("Type", {
  Neutral: "Neutral",
  Error: "Error",
})
const children = (figma.selectedInstance.findText("Line 1") as { textContent: string })?.textContent
const description = figma.selectedInstance.getBoolean("Show Line 2", {
  true: (figma.selectedInstance.findText("Line 2") as { textContent: string })?.textContent,
  false: undefined,
})
const showLine2 = figma.selectedInstance.getBoolean("Show Line 2")
const icon = figma.selectedInstance.getBoolean("Show Icon", {
  true: figma.selectedInstance.getInstanceSwap("Icon")?.executeTemplate()
    .example,
  false: undefined,
})
const showIcon = figma.selectedInstance.getBoolean("Show Icon")
const flipIcon = figma.selectedInstance.getBoolean("Flip Icon")
const action = figma.selectedInstance.getBoolean("Show Button", {
  true: figma.helpers.react.jsxElement(
    '<Button variant="outline">Action</Button>',
  ),
  false: undefined,
})

export default {
  id: "Alert",
  imports: ["import { Alert } from './Alert';"],
  example: figma.code`<Alert type="${type}"${figma.helpers.react.renderProp("description", description)} showLine2={${showLine2}}${figma.helpers.react.renderProp("icon", icon)} showIcon={${showIcon}} flipIcon={${flipIcon}}${figma.helpers.react.renderProp("action", action)}>
      ${children}
    </Alert>`,
  metadata: { nestable: true },
}

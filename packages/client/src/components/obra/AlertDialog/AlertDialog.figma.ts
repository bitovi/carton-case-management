// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=139-11941
// component=AlertDialog

import figma from "figma"

const type = figma.selectedInstance.getEnum("Type", {
  Desktop: "desktop",
  Mobile: "mobile",
})
const title = (figma.selectedInstance.findText("Title") as { textContent: string })?.textContent
const description = (figma.selectedInstance.findText("Text") as { textContent: string })?.textContent

export default {
  id: "AlertDialog",
  imports: [
    "import { AlertDialog } from './AlertDialog';",
    "import { Button } from '../Button';",
  ],
  example: figma.code`<AlertDialog type="${type}" title="${title}" description="${description}" actionButton={<Button variant="primary">Label</Button>} cancelButton={<Button variant="outline">Label</Button>}/>`,

  metadata: { nestable: true },
}

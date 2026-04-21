// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=151-12298
// component=Dialog

import figma from "figma"

const type = figma.selectedInstance.getEnum("Type", {
  Desktop: "Desktop",
  "Desktop Scrollable": "Desktop Scrollable",
  Mobile: "Mobile",
  "Mobile Full Screen Scrollable": "Mobile Full Screen Scrollable",
})

export default {
  id: "Dialog",
  imports: [
    "import { Dialog } from './Dialog';",
    "import { DialogHeader } from './DialogHeader/DialogHeader';",
    "import { DialogFooter } from './DialogFooter/DialogFooter';",
    "import { Button } from '../Button';",
  ],
  example: figma.code`<Dialog open={true} onOpenChange={() => { }}${figma.helpers.react.renderProp(
    "type",
    type,
  )} header={<DialogHeader type="Header" title="Title" onClose={() => { }}/>} footer={<DialogFooter type="2 Buttons Right">
          <Button variant="outline">Secondary</Button>
          <Button variant="primary">Primary</Button>
        </DialogFooter>}>
      <div>Content</div>
    </Dialog>`,
  metadata: { nestable: true },
}

// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=2335-26&m=dev
// component=Popover

import figma from "figma"

const children = figma.properties.children(["*"])

export default {
  id: "Popover",
  imports: [
    "import { Popover, PopoverTrigger, PopoverContent } from './Popover';",
    "import { Button } from '../Button';",
  ],
  example: figma.code`<Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        ${figma.helpers.react.renderChildren(children)}
      </PopoverContent>
    </Popover>`,
  metadata: { nestable: true },
}

// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=179-29234
// component=Card

import figma from "figma"

export default {
  id: "Card",
  imports: ["import { Card } from './Card';"],
  example: figma.code`<Card header={<div>Header content</div>} main={<div>Main content</div>} footer={<div>Footer content</div>}/>`,
}

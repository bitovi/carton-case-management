// url=https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-119954&m=dev
// component=Calendar

import figma from "figma"

const months = figma.selectedInstance.getEnum("Months", {
  "1 Month": 1,
  "2 months": 2,
  "3 months": 3,
})

export default {
  id: "Calendar",
  imports: ["import { Calendar } from './Calendar';"],
  example: figma.code`<Calendar mode="single" numberOfMonths={${months}} selected={new Date()} onSelect={(date) => console.log(date)}/>`,

  metadata: { nestable: true },
}

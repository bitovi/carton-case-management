// url=https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1031-2046
// component=FiltersTrigger

import figma from "figma"

const _state = figma.selectedInstance.getEnum("State", {
  Rest: "rest",
  Applied: "applied",
  Selected: "selected",
})

export default {
  id: "FiltersTrigger",
  imports: ["import { FiltersTrigger } from './FiltersTrigger';"],
  example: figma.code`function Example() {
    const activeCount = ${_state} === 'applied' ? 1 : 0;
    const selected = ${_state} === 'selected';
    return (<FiltersTrigger activeCount={activeCount} selected={selected} onClick={() => { }}/>);
}`,
  metadata: { nestable: false },
}

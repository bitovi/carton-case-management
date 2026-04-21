// url=https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3311-8265
// component=VoterTooltip

import figma from "figma"

const type = figma.selectedInstance.getEnum("Type", {
  Up: "up",
  Down: "down",
})

export default {
  id: "VoterTooltip",
  imports: ["import { VoterTooltip } from './VoterTooltip';"],
  example: figma.code`<VoterTooltip type="${type}" trigger={<button>Hover trigger</button>}>
      <span>Voter Name</span>
    </VoterTooltip>`,
  metadata: { nestable: true },
}

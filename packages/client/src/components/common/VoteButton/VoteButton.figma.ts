// url=https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2779
// component=VoteButton

import figma from "figma"

export default {
  id: "VoteButton",
  imports: ["import { VoteButton } from './VoteButton';"],
  example: figma.code`<VoteButton type="up" active={false} showCount={true} count={1}/>`,
}

// url=https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2958
// component=ReactionStatistics

import figma from "figma"

export default {
  id: "ReactionStatistics",
  imports: ["import { ReactionStatistics } from './ReactionStatistics';"],
  example: figma.code`<ReactionStatistics userVote="none" upvotes={1} downvotes={1}/>`,
}

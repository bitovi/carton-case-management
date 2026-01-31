import figma from '@figma/code-connect';
import { ReactionStatistics } from './ReactionStatistics';


figma.connect(
  ReactionStatistics,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2958',
  {
    example: () => (
      <ReactionStatistics
        userVote="none"
        upvotes={1}
        downvotes={1}
      />
    ),
  }
);

import figma from '@figma/code-connect';
import { ReactionStatistics } from './ReactionStatistics';

const reactionStatisticsConfig = {
  example: () => (
    <ReactionStatistics
      userVote="none"
      upvotes={1}
      downvotes={1}
    />
  ),
};

// Connect to main Carton Case Management designs
figma.connect(
  ReactionStatistics,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2958',
  { ...reactionStatisticsConfig }
);

// Connect to Riot Training version
figma.connect(
  ReactionStatistics,
  'https://www.figma.com/design/7W0r8XwvVXzGSOJhvV9c3o/App-Design?node-id=3299-2958',
  { ...reactionStatisticsConfig }
);

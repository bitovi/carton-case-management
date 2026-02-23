import figma from '@figma/code-connect';
import { ReactionStatistics } from './ReactionStatistics';

// Connect to main Carton Case Management designs
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

// Connect to Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  ReactionStatistics,
  'https://www.figma.com/design/zm8VZCEsJFFxJOiSC1HtUt/Riot-Games-App-Design?node-id=3299-2958',
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

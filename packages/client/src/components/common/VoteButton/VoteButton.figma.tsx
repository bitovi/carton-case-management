import figma from '@figma/code-connect';
import { VoteButton } from './VoteButton';

const voteButtonConfig = {
  example: () => (
    <VoteButton
      type="up"
      active={false}
      showCount={true}
      count={1}
    />
  ),
};

// Connect to main Carton Case Management designs
figma.connect(
  VoteButton,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2779',
  { ...voteButtonConfig }
);

// Connect to Riot Training version
figma.connect(
  VoteButton,
  'https://www.figma.com/design/7W0r8XwvVXzGSOJhvV9c3o/App-Design?node-id=3299-2779',
  { ...voteButtonConfig }
);


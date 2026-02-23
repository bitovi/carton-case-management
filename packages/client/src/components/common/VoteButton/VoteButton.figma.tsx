import figma from '@figma/code-connect';
import { VoteButton } from './VoteButton';

// Connect to main Carton Case Management designs
figma.connect(
  VoteButton,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3299-2779',
  {
    example: () => (
      <VoteButton
        type="up"
        active={false}
        showCount={true}
        count={1}
      />
    ),
  }
);

// Connect to Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  VoteButton,
  'https://www.figma.com/design/zm8VZCEsJFFxJOiSC1HtUt/Riot-Games-App-Design?node-id=3299-2779',
  {
    example: () => (
      <VoteButton
        type="up"
        active={false}
        showCount={true}
        count={1}
      />
    ),
  }
);


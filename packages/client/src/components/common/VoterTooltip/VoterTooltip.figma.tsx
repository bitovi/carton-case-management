import figma from '@figma/code-connect';
import { VoterTooltip } from './VoterTooltip';

// Connect to main Carton Case Management designs
figma.connect(
  VoterTooltip,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3311-8265',
  {
  props: {
    type: figma.enum('Type', {
      Up: 'up',
      Down: 'down',
    }),
  },
  example: ({ type }: { type: 'up' | 'down' }) => (
    <VoterTooltip 
      type={type}
      trigger={<button>Hover trigger</button>}
    >
      <span>Voter Name</span>
    </VoterTooltip>
  ),
}
);

// Connect to Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  VoterTooltip,
  'https://www.figma.com/design/zm8VZCEsJFFxJOiSC1HtUt/Riot-Games-App-Design?node-id=3311-8265',
  {
  props: {
    type: figma.enum('Type', {
      Up: 'up',
      Down: 'down',
    }),
  },
  example: ({ type }: { type: 'up' | 'down' }) => (
    <VoterTooltip 
      type={type}
      trigger={<button>Hover trigger</button>}
    >
      <span>Voter Name</span>
    </VoterTooltip>
  ),
}
);

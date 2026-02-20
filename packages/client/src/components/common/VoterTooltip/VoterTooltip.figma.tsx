import figma from '@figma/code-connect';
import { VoterTooltip } from './VoterTooltip';

const voterTooltipConfig = {
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
};

// Connect to main Carton Case Management designs
figma.connect(
  VoterTooltip,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=3311-8265',
  { ...voterTooltipConfig }
);

// Connect to Riot Training version
figma.connect(
  VoterTooltip,
  'https://www.figma.com/design/7W0r8XwvVXzGSOJhvV9c3o/App-Design?node-id=3311-8265',
  { ...voterTooltipConfig }
);

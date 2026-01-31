import figma from '@figma/code-connect';
import { VoterTooltip } from './VoterTooltip';



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
    example: ({ type }) => (
      <VoterTooltip 
        type={type}
        trigger={<button>Hover trigger</button>}
      >
        <span>Voter Name</span>
      </VoterTooltip>
    ),
  }
);

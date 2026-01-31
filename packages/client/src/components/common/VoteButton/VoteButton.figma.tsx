import figma from '@figma/code-connect';
import { VoteButton } from './VoteButton';


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


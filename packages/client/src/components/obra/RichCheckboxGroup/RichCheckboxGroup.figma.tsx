import figma from '@figma/code-connect';
import { RichCheckboxGroup } from './RichCheckboxGroup';

figma.connect(
  RichCheckboxGroup,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6351',
  {
    props: {
      checked: figma.enum('Checked?', {
        False: false,
        True: true,
      }),
      flipped: figma.enum('Flipped', {
        False: false,
        True: true,
      }),
    },
    example: (props) => (
      <RichCheckboxGroup
        checked={props.checked}
        flipped={props.flipped}
        label="Label"
        secondaryText="Secondary text"
        onCheckedChange={() => {}}
      />
    ),
  }
);

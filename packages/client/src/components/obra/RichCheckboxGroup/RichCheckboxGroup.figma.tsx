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

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  RichCheckboxGroup,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=19-6351',
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

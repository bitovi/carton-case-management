import figma from '@figma/code-connect';
import { CheckboxGroup } from './CheckboxGroup';

figma.connect(
  CheckboxGroup,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6040',
  {
  props: {
    layout: figma.enum('Layout', {
      Inline: 'inline',
      Block: 'block',
    }),
    checked: figma.enum('Checked?', {
      False: false,
      True: true,
    }),
  },
  example: (props) => (
    <CheckboxGroup
      layout={props.layout}
      checked={props.checked}
      label="Label"
      onCheckedChange={() => {}}
    />
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  CheckboxGroup,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=19-6040',
  {
  props: {
    layout: figma.enum('Layout', {
      Inline: 'inline',
      Block: 'block',
    }),
    checked: figma.enum('Checked?', {
      False: false,
      True: true,
    }),
  },
  example: (props) => (
    <CheckboxGroup
      layout={props.layout}
      checked={props.checked}
      label="Label"
      onCheckedChange={() => {}}
    />
  ),
}
);

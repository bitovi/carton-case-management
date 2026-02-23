import figma from '@figma/code-connect';
import { Checkbox } from './Checkbox';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1790',
  {
  props: {
    checked: figma.enum('Checked?', {
      False: false,
      True: true,
      Indeterminate: 'indeterminate',
    }),
    error: figma.enum('State', {
      Default: false,
      Focus: false,
      Error: true,
      'Error Focus': true,
      Disabled: false,
    }),
    disabled: figma.enum('State', {
      Default: false,
      Focus: false,
      Error: false,
      'Error Focus': false,
      Disabled: true,
    }),
  },
  example: ({ checked, error, disabled }) => (
    <Checkbox checked={checked} error={error} disabled={disabled} />
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Checkbox,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=16-1790',
  {
  props: {
    checked: figma.enum('Checked?', {
      False: false,
      True: true,
      Indeterminate: 'indeterminate',
    }),
    error: figma.enum('State', {
      Default: false,
      Focus: false,
      Error: true,
      'Error Focus': true,
      Disabled: false,
    }),
    disabled: figma.enum('State', {
      Default: false,
      Focus: false,
      Error: false,
      'Error Focus': false,
      Disabled: true,
    }),
  },
  example: ({ checked, error, disabled }) => (
    <Checkbox checked={checked} error={error} disabled={disabled} />
  ),
}
);

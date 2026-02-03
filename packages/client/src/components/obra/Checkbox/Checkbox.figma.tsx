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

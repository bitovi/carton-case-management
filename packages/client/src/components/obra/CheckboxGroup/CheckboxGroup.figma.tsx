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

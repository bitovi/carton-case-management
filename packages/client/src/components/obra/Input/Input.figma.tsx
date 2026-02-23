import { figma } from '@figma/code-connect';
import { Input } from './Input';

figma.connect(
  Input,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1738&m=dev',
  {
  props: {
    size: figma.enum('Size', {
      Mini: 'mini',
      Small: 'small',
      Regular: 'regular',
      Large: 'large',
    }),
    
    roundness: figma.enum('Roundness', {
      Default: 'default',
      Round: 'round',
    }),
    error: figma.enum('State', {
      Error: true,
      'Error Focus': true,
    }),
    
    disabled: figma.enum('State', {
      Disabled: true,
    }),
    
    placeholder: figma.enum('State', {
      Empty: '',
      Placeholder: figma.string('Placeholder text'),
    }),
  },
  
  example: (props) => <Input {...props} />,
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Input,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=16-1738',
  {
  props: {
    size: figma.enum('Size', {
      Mini: 'mini',
      Small: 'small',
      Regular: 'regular',
      Large: 'large',
    }),
    
    roundness: figma.enum('Roundness', {
      Default: 'default',
      Round: 'round',
    }),
    error: figma.enum('State', {
      Error: true,
      'Error Focus': true,
    }),
    
    disabled: figma.enum('State', {
      Disabled: true,
    }),
    
    placeholder: figma.enum('State', {
      Empty: '',
      Placeholder: figma.string('Placeholder text'),
    }),
  },
  
  example: (props) => <Input {...props} />,
}
);

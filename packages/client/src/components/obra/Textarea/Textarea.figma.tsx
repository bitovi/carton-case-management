import figma from '@figma/code-connect';
import { Textarea } from './Textarea';

figma.connect(
  Textarea,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1745',
  {
  props: {
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
      Placeholder: 'Type your message here.',
    }),
    defaultValue: figma.enum('State', {
      Value: 'Value',
      Focus: 'Value',
      Error: 'Value',
      'Error Focus': 'Value',
      Disabled: 'Value',
    }),
  },
  example: ({ roundness, error, disabled, placeholder, defaultValue }) => (
    <Textarea
      roundness={roundness}
      error={error}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Textarea,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=16-1745',
  {
  props: {
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
      Placeholder: 'Type your message here.',
    }),
    defaultValue: figma.enum('State', {
      Value: 'Value',
      Focus: 'Value',
      Error: 'Value',
      'Error Focus': 'Value',
      Disabled: 'Value',
    }),
  },
  example: ({ roundness, error, disabled, placeholder, defaultValue }) => (
    <Textarea
      roundness={roundness}
      error={error}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  ),
}
);


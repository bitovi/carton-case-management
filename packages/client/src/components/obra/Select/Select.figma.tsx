import {
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
} from './Select';
import figma from '@figma/code-connect';

figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1732',
  {
    props: {
      size: figma.enum('Size', {
        Mini: 'mini',
        Small: 'small',
        Regular: 'regular',
        Large: 'large',
      }),
      layout: figma.enum('Lines', {
        '1 Line': 'single',
        '2 Lines': 'stacked',
      }),
      error: figma.enum('State', {
        Error: true,
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: (props) => (
      <SelectTrigger
        size={props.size}
        layout={props.layout}
        error={props.error}
        disabled={props.disabled}
      />
    ),
  }
);

figma.connect(
  SelectContent,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-27848',
  {
    props: {
      children: figma.children('*'),
    },
    example: (props) => (
      <SelectContent>
        {props.children}
      </SelectContent>
    ),
  }
);

figma.connect(
  SelectItem,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=18-1010',
  {
    props: {
      size: figma.enum('Size', {
        Regular: 'regular',
        Large: 'large',
      }),
      type: figma.enum('Type', {
        Default: 'default',
        Destructive: 'destructive',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: (props) => (
      <SelectItem
        value="value"
        size={props.size}
        type={props.type}
        disabled={props.disabled}
      >
        Item text
      </SelectItem>
    ),
  }
);

figma.connect(
  SelectLabel,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=80-10189',
  {
    props: {
      size: figma.enum('Type', {
        Small: 'small',
        Regular: 'regular',
      }),
    },
    example: (props) => (
      <SelectLabel size={props.size}>
        Label text
      </SelectLabel>
    ),
  }
);



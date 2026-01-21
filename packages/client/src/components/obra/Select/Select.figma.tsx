import figma from '@figma/code-connect';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
} from './index';

/**
 * SelectTrigger - Size=Default, State=Default, Lines=1 Line
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=16:1730',
  {
    variant: { Size: 'Default', State: 'Default', Lines: '1 Line' },
    example: () => (
      <Select>
        <SelectTrigger size="default">
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectTrigger - Size=Default, State=Focus, Lines=1 Line
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=16:1731',
  {
    variant: { Size: 'Default', State: 'Focus', Lines: '1 Line' },
    example: () => (
      <Select>
        <SelectTrigger size="default">
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectTrigger - Size=Default, State=Error, Lines=1 Line
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=18:980',
  {
    variant: { Size: 'Default', State: 'Error', Lines: '1 Line' },
    example: () => (
      <Select>
        <SelectTrigger size="default" state="error">
          <SelectValue placeholder="Required field" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectTrigger - Size=Default, State=Disabled, Lines=1 Line
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=18:976',
  {
    variant: { Size: 'Default', State: 'Disabled', Lines: '1 Line' },
    example: () => (
      <Select disabled>
        <SelectTrigger size="default">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectTrigger - Size=Large, State=Default, Lines=1 Line
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=19:1478',
  {
    variant: { Size: 'Large', State: 'Default', Lines: '1 Line' },
    example: () => (
      <Select>
        <SelectTrigger size="lg">
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectTrigger - Size=Small, State=Default, Lines=1 Line
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=19:1574',
  {
    variant: { Size: 'Small', State: 'Default', Lines: '1 Line' },
    example: () => (
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectTrigger - Size=Mini, State=Default, Lines=1 Line
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=281:105885',
  {
    variant: { Size: 'Mini', State: 'Default', Lines: '1 Line' },
    example: () => (
      <Select>
        <SelectTrigger size="mini">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectTrigger - Size=Default, State=Default, Lines=2 Lines
 */
figma.connect(
  SelectTrigger,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=68:17940',
  {
    variant: { Size: 'Default', State: 'Default', Lines: '2 Lines' },
    example: () => (
      <Select>
        <SelectTrigger size="default" lines="double">
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
      </Select>
    ),
  }
);

/**
 * SelectItem - Size=Regular, Type=Default, State=Default
 */
figma.connect(
  SelectItem,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=18:995',
  {
    variant: { Size: 'Regular', Type: 'Default', State: 'Default' },
    props: {
      children: figma.textContent('Label'),
    },
    example: ({ children }) => <SelectItem value="item">{children}</SelectItem>,
  }
);

/**
 * SelectItem - Size=Regular, Type=Destructive, State=Default
 */
figma.connect(
  SelectItem,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=68:17850',
  {
    variant: { Size: 'Regular', Type: 'Destructive', State: 'Default' },
    props: {
      children: figma.textContent('Label'),
    },
    example: ({ children }) => (
      <SelectItem value="delete" variant="destructive">
        {children}
      </SelectItem>
    ),
  }
);

/**
 * SelectItem - Size=Large, Type=Default, State=Default
 */
figma.connect(
  SelectItem,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=176:26563',
  {
    variant: { Size: 'Large', Type: 'Default', State: 'Default' },
    props: {
      children: figma.textContent('Label'),
    },
    example: ({ children }) => (
      <SelectItem value="item" size="lg">
        {children}
      </SelectItem>
    ),
  }
);

/**
 * SelectLabel - Type=Small, Indented?=False
 */
figma.connect(
  SelectLabel,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=18:998',
  {
    variant: { Type: 'Small', 'Indented?': 'False' },
    props: {
      children: figma.textContent('*'),
    },
    example: ({ children }) => <SelectLabel size="sm">{children}</SelectLabel>,
  }
);

/**
 * SelectLabel - Type=Small, Indented?=True
 */
figma.connect(
  SelectLabel,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=80:10188',
  {
    variant: { Type: 'Small', 'Indented?': 'True' },
    props: {
      children: figma.textContent('*'),
    },
    example: ({ children }) => (
      <SelectLabel size="sm" indented>
        {children}
      </SelectLabel>
    ),
  }
);

/**
 * SelectLabel - Type=Regular, Indented?=False
 */
figma.connect(
  SelectLabel,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=80:10194',
  {
    variant: { Type: 'Regular', 'Indented?': 'False' },
    props: {
      children: figma.textContent('*'),
    },
    example: ({ children }) => <SelectLabel>{children}</SelectLabel>,
  }
);

/**
 * SelectLabel - Type=Regular, Indented?=True
 */
figma.connect(
  SelectLabel,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=80:10196',
  {
    variant: { Type: 'Regular', 'Indented?': 'True' },
    props: {
      children: figma.textContent('*'),
    },
    example: ({ children }) => <SelectLabel indented>{children}</SelectLabel>,
  }
);

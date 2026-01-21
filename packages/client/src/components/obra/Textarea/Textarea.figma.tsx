import figma from '@figma/code-connect';
import { Textarea } from './Textarea';

// Code Connect mapping for Textarea - Default Roundness
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=140:11507',
  {
    props: {
      rounded: figma.enum('Roundness', {
        Default: false,
        Round: true,
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      error: figma.enum('State', {
        Error: true,
        'Error Focus': true,
      }),
    },
    example: ({ rounded, disabled, error }) => (
      <Textarea
        rounded={rounded}
        disabled={disabled}
        error={error}
        placeholder="Type your message here."
      />
    ),
  }
);

// Empty state
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=140:11507',
  {
    variant: { State: 'Empty' },
    example: () => <Textarea />,
  }
);

// Placeholder state
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=16:1744',
  {
    variant: { State: 'Placeholder' },
    example: () => <Textarea placeholder="Type your message here." />,
  }
);

// Value state
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=16:1743',
  {
    variant: { State: 'Value' },
    example: () => <Textarea defaultValue="Value" />,
  }
);

// Focus state
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=140:11514',
  {
    variant: { State: 'Focus' },
    example: () => <Textarea defaultValue="Value" />,
  }
);

// Error state
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=18:984',
  {
    variant: { State: 'Error' },
    example: () => <Textarea error defaultValue="Value" />,
  }
);

// Error Focus state
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=19:1057',
  {
    variant: { State: 'Error Focus' },
    example: () => <Textarea error defaultValue="Value" />,
  }
);

// Disabled state
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=19:1060',
  {
    variant: { State: 'Disabled' },
    example: () => <Textarea disabled defaultValue="Value" />,
  }
);

// Round variant - Empty
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=757:125059',
  {
    variant: { Roundness: 'Round', State: 'Empty' },
    example: () => <Textarea rounded />,
  }
);

// Round variant - Placeholder
figma.connect(
  Textarea,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=757:125061',
  {
    variant: { Roundness: 'Round', State: 'Placeholder' },
    example: () => <Textarea rounded placeholder="Type your message here." />,
  }
);

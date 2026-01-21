import figma from '@figma/code-connect';
import { Calendar } from './Calendar';

// Main Calendar component - 1 Month variant
figma.connect(
  Calendar,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=190:27724',
  {
    props: {
      numberOfMonths: figma.enum('Months', {
        '1 Month': 1,
        '2 months': 2,
        '3 months': 3,
      }),
    },
    example: ({ numberOfMonths }) => (
      <Calendar numberOfMonths={numberOfMonths} />
    ),
  }
);

// Calendar - 2 Months variant
figma.connect(
  Calendar,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=190:27722',
  {
    props: {},
    example: () => <Calendar numberOfMonths={2} />,
  }
);

// Calendar - 3 Months variant
figma.connect(
  Calendar,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=190:27721',
  {
    props: {},
    example: () => <Calendar numberOfMonths={3} />,
  }
);

// Calendar with single selection
figma.connect(
  Calendar,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288:120405',
  {
    props: {},
    example: () => (
      <Calendar mode="single" selected={new Date()} onSelect={() => {}} />
    ),
  }
);

// Calendar with range selection (2 months)
figma.connect(
  Calendar,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288:120408',
  {
    props: {},
    example: () => (
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={{ from: new Date(), to: new Date() }}
        onSelect={() => {}}
      />
    ),
  }
);

// Calendar with range selection (3 months)
figma.connect(
  Calendar,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288:120411',
  {
    props: {},
    example: () => (
      <Calendar
        mode="range"
        numberOfMonths={3}
        selected={{ from: new Date(), to: new Date() }}
        onSelect={() => {}}
      />
    ),
  }
);

// Calendar with disabled days
figma.connect(
  Calendar,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=363:30518',
  {
    props: {},
    example: () => (
      <Calendar
        mode="single"
        disabled={[new Date()]}
        onSelect={() => {}}
      />
    ),
  }
);

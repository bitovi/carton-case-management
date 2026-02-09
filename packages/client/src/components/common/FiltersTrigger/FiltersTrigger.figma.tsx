import figma from '@figma/code-connect';
import { FiltersTrigger } from './FiltersTrigger';

figma.connect(
  FiltersTrigger,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1031-2046',
  {
    props: {
      state: figma.enum('State', {
        Rest: 'rest',
        Applied: 'applied',
        Selected: 'selected',
      }),
    },
    example: ({ state }) => {
      const activeCount = state === 'applied' ? 1 : 0;
      const selected = state === 'selected';
      
      return (
        <FiltersTrigger
          activeCount={activeCount}
          selected={selected}
          onClick={() => {}}
        />
      );
    },
  }
);

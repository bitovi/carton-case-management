import figma from '@figma/code-connect';
import { FiltersTrigger } from './FiltersTrigger';

const filtersTriggerConfig = {
  props: {
    state: figma.enum('State', {
      Rest: 'rest',
      Applied: 'applied',
      Selected: 'selected',
    }),
  },
  example: ({ state }: { state: 'rest' | 'applied' | 'selected' }) => {
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
};

// Connect to main Carton Case Management designs
figma.connect(
  FiltersTrigger,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1031-2046',
  { ...filtersTriggerConfig }
);

// Connect to Riot Training version
figma.connect(
  FiltersTrigger,
  'https://www.figma.com/design/7W0r8XwvVXzGSOJhvV9c3o/App-Design?node-id=1031-2046',
  { ...filtersTriggerConfig }
);

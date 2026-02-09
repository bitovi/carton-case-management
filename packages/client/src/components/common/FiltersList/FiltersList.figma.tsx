import figma from '@figma/code-connect';
import { FiltersList } from './FiltersList';

figma.connect(
  FiltersList,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1033-19601',
  {
    props: {},
    example: () => (
      <FiltersList
        title="Filters"
        filters={[
          {
            id: 'customer',
            label: 'Customer',
            value: 'none',
            count: 0,
            options: [
              { value: 'none', label: 'None selected' },
              { value: 'customer1', label: 'Customer 1' },
            ],
            onChange: () => {},
          },
          {
            id: 'status',
            label: 'Status',
            value: 'todo',
            count: 1,
            options: [
              { value: 'none', label: 'None selected' },
              { value: 'todo', label: 'To Do' },
            ],
            onChange: () => {},
          },
        ]}
      />
    ),
  }
);

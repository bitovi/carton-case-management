import figma from '@figma/code-connect';
import { FiltersDialog } from './FiltersDialog';

// Connect to main Carton Case Management designs
figma.connect(
  FiltersDialog,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=2941-9234',
  {
  props: {},
  example: () => (
    <FiltersDialog
      open={true}
      onOpenChange={() => {}}
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
      onApply={() => {}}
      onClear={() => {}}
    />
  ),
}
);

// Connect to Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  FiltersDialog,
  'https://www.figma.com/design/zm8VZCEsJFFxJOiSC1HtUt/Riot-Games-App-Design?node-id=1033-19601',
  {
  props: {},
  example: () => (
    <FiltersDialog
      open={true}
      onOpenChange={() => {}}
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
      onApply={() => {}}
      onClear={() => {}}
    />
  ),
}
);

import figma from '@figma/code-connect';
import { RelationshipManagerList } from './RelationshipManagerList';

// Connect to main Carton Case Management designs
figma.connect(
  RelationshipManagerList,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1043-2055',
  {
  props: {},
  example: () => (
    <RelationshipManagerList
      title="Available Cases"
      items={[
        {
          id: '1',
          title: 'Policy Coverage Inquiry',
          subtitle: '#CAS-242315-2125',
          selected: true,
        },
        {
          id: '2',
          title: 'Premium Adjustment Request',
          subtitle: '#CAS-242315-2126',
          selected: false,
        },
        {
          id: '3',
          title: 'Claim Status Update',
          subtitle: '#CAS-242315-2127',
          selected: false,
        },
        {
          id: '4',
          title: 'Fraud Investigation',
          subtitle: '#CAS-242315-2128',
          selected: false,
        },
      ]}
      onItemToggle={() => {}}
    />
  ),
}
);

// Connect to Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  RelationshipManagerList,
  'https://www.figma.com/design/zm8VZCEsJFFxJOiSC1HtUt/Riot-Games-App-Design?node-id=1043-2055',
  {
  props: {},
  example: () => (
    <RelationshipManagerList
      title="Available Cases"
      items={[
        {
          id: '1',
          title: 'Policy Coverage Inquiry',
          subtitle: '#CAS-242315-2125',
          selected: true,
        },
        {
          id: '2',
          title: 'Premium Adjustment Request',
          subtitle: '#CAS-242315-2126',
          selected: false,
        },
        {
          id: '3',
          title: 'Claim Status Update',
          subtitle: '#CAS-242315-2127',
          selected: false,
        },
        {
          id: '4',
          title: 'Fraud Investigation',
          subtitle: '#CAS-242315-2128',
          selected: false,
        },
      ]}
      onItemToggle={() => {}}
    />
  ),
}
);

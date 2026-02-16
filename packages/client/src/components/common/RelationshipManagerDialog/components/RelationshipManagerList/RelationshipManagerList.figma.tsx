import figma from '@figma/code-connect';
import { RelationshipManagerList } from './RelationshipManagerList';

const relationshipManagerListConfig = {
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
};

// Connect to main Carton Case Management designs
figma.connect(
  RelationshipManagerList,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1043-2055',
  { ...relationshipManagerListConfig }
);

// Connect to Riot Training version
figma.connect(
  RelationshipManagerList,
  'https://www.figma.com/design/7W0r8XwvVXzGSOJhvV9c3o/App-Design?node-id=1043-2055',
  { ...relationshipManagerListConfig }
);

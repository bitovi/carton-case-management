import figma from '@figma/code-connect';
import { RelationshipManagerDialog } from './RelationshipManagerDialog';

figma.connect(
  RelationshipManagerDialog,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1043-1742',
  {
    props: {},
    example: () => (
      <RelationshipManagerDialog
        open={true}
        onOpenChange={() => {}}
        items={[
          {
            id: '1',
            title: 'Policy Coverage Inquiry',
            subtitle: '#CAS-242315-2125',
          },
          {
            id: '2',
            title: 'Premium Adjustment Request',
            subtitle: '#CAS-242315-2126',
          },
        ]}
        selectedItems={['1']}
        onSelectionChange={() => {}}
        onAdd={() => {}}
      />
    ),
  }
);

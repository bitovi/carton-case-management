import figma from '@figma/code-connect';
import { RelationshipManagerAccordion } from './RelationshipManagerAccordion';

figma.connect(
  RelationshipManagerAccordion,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1040-1662',
  {
    props: {
      defaultOpen: figma.enum('State', {
        Closed: false,
        Open: true,
      }),
    },
    example: ({ defaultOpen }) => (
      <RelationshipManagerAccordion
        accordionTitle="Related Cases"
        defaultOpen={defaultOpen}
        items={[
          {
            id: '1',
            title: 'Policy Coverage Inquiry',
            subtitle: '#CAS-242315-2125',
          },
        ]}
        onAddClick={() => {}}
      />
    ),
  }
);

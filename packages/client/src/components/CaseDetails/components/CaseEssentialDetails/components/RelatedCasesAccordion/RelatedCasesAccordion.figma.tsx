import figma from '@figma/code-connect';
import { RelatedCasesAccordion } from './RelatedCasesAccordion';

figma.connect(
  RelatedCasesAccordion,
  'https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1040-1662',
  {
    props: {
      defaultOpen: figma.enum('State', {
        Closed: false,
        Open: true,
      }),
    },
    example: ({ defaultOpen }) => (
      <RelatedCasesAccordion
        defaultOpen={defaultOpen}
        cases={[
          {
            id: '1',
            title: 'Policy Coverage Inquiry',
            caseNumber: '#CAS-242315-2125',
          },
        ]}
        onAddClick={() => {}}
      />
    ),
  }
);

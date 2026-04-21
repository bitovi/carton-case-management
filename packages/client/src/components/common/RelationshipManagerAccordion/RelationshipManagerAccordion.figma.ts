// url=https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1040-1662
// component=RelationshipManagerAccordion

import figma from "figma"

const defaultOpen = figma.selectedInstance.getEnum("State", {
  Closed: false,
  Open: true,
})

export default {
  id: "RelationshipManagerAccordion",
  imports: [
    "import { RelationshipManagerAccordion } from './RelationshipManagerAccordion';",
  ],
  example: figma.code`<RelationshipManagerAccordion accordionTitle="Related Cases" defaultOpen={${defaultOpen}} items={[
        {
            id: '1',
            title: 'Policy Coverage Inquiry',
            subtitle: '#CAS-242315-2125',
            to: '/cases/1',
        },
    ]} onAddClick={() => { }}/>`,
  metadata: { nestable: true },
}

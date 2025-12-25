import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');

  // Delete all existing data in correct order (respecting foreign keys)
  await prisma.comment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create demo users
  const alex = await prisma.user.create({
    data: {
      email: 'alex.morgan@example.com',
      name: 'Alex Morgan',
      password: 'hashed_password_here', // In production, use bcrypt
    },
  });

  const jordan = await prisma.user.create({
    data: {
      email: 'jordan.lee@example.com',
      name: 'Jordan Lee',
      password: 'hashed_password_here',
    },
  });

  console.log('Creating cases...');

  // Create cases matching Figma design
  const case1 = await prisma.case.create({
    data: {
      title: '#CAS-242314-2124',
      caseType: 'Insurance Claim Dispute',
      description:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      customerName: 'Sarah Johnson',
      status: 'OPEN',
      createdBy: jordan.id,
      assignedTo: alex.id,
      createdAt: new Date('2025-10-24'),
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: '#CAS-242315-2125',
      caseType: 'Policy Coverage Inquiry',
      description:
        'Customer inquiring about coverage for elective medical procedures not covered under standard policy. Requires review of policy documents and discussion with underwriting.',
      customerName: 'Michael Chen',
      status: 'IN_PROGRESS',
      createdBy: alex.id,
      assignedTo: alex.id,
      createdAt: new Date('2025-11-15'),
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: '#CAS-242316-2126',
      caseType: 'Premium Adjustment Request',
      description:
        'Policyholder requesting premium adjustment after change in risk profile. Customer has improved credit score and completed safety training.',
      customerName: 'Emily Rodriguez',
      status: 'PENDING',
      createdBy: jordan.id,
      assignedTo: alex.id,
      createdAt: new Date('2025-11-20'),
    },
  });

  const case4 = await prisma.case.create({
    data: {
      title: '#CAS-242317-2127',
      caseType: 'Claim Status Update',
      description:
        'Customer requesting status update on claim filed 3 weeks ago for water damage. Adjuster has completed inspection but report is pending.',
      customerName: 'David Thompson',
      status: 'IN_PROGRESS',
      createdBy: alex.id,
      assignedTo: jordan.id,
      createdAt: new Date('2025-11-25'),
    },
  });

  const case5 = await prisma.case.create({
    data: {
      title: '#CAS-242318-2128',
      caseType: 'Fraud Investigation',
      description:
        'Multiple claims filed by same party with inconsistent information. Requires investigation and potential coordination with law enforcement.',
      customerName: 'Suspicious Activity Report',
      status: 'OPEN',
      createdBy: jordan.id,
      assignedTo: jordan.id,
      createdAt: new Date('2025-12-01'),
    },
  });

  console.log('Creating comments...');

  // Comments for Case 1
  await prisma.comment.create({
    data: {
      content:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      caseId: case1.id,
      authorId: alex.id,
      createdAt: new Date('2025-11-29T11:55:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Verified income documentation and confirmed eligibility for Housing First program. Moving forward with application process.',
      caseId: case1.id,
      authorId: alex.id,
      createdAt: new Date('2025-12-01T14:30:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Contacted property management for available units. Will schedule viewing for client next week.',
      caseId: case1.id,
      authorId: jordan.id,
      createdAt: new Date('2025-12-05T09:15:00Z'),
    },
  });

  // Comments for Case 2
  await prisma.comment.create({
    data: {
      content:
        'Reviewed policy documents. Elective procedures are explicitly excluded under Section 4.2 of the policy.',
      caseId: case2.id,
      authorId: alex.id,
      createdAt: new Date('2025-11-16T10:00:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Customer requesting appeal. Scheduling call with underwriting to discuss potential exceptions.',
      caseId: case2.id,
      authorId: alex.id,
      createdAt: new Date('2025-11-18T15:45:00Z'),
    },
  });

  // Comments for Case 3
  await prisma.comment.create({
    data: {
      content:
        'Received updated credit report showing 50-point improvement. Reviewing for premium adjustment eligibility.',
      caseId: case3.id,
      authorId: jordan.id,
      createdAt: new Date('2025-11-21T11:20:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Safety training certificate verified. Approved for 10% premium reduction effective next billing cycle.',
      caseId: case3.id,
      authorId: alex.id,
      createdAt: new Date('2025-11-23T16:30:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Sent confirmation letter to customer with new premium amount.',
      caseId: case3.id,
      authorId: alex.id,
      createdAt: new Date('2025-11-24T09:00:00Z'),
    },
  });

  // Comments for Case 4
  await prisma.comment.create({
    data: {
      content: 'Adjuster completed inspection on 12/15. Waiting for final report from inspection department.',
      caseId: case4.id,
      authorId: alex.id,
      createdAt: new Date('2025-12-02T14:00:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Called customer to provide status update. Customer satisfied with timeline.',
      caseId: case4.id,
      authorId: jordan.id,
      createdAt: new Date('2025-12-03T10:30:00Z'),
    },
  });

  // Comments for Case 5
  await prisma.comment.create({
    data: {
      content: 'Initial review shows 3 claims filed within 2 months with different vehicle VINs reported.',
      caseId: case5.id,
      authorId: jordan.id,
      createdAt: new Date('2025-12-02T09:00:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Escalated to fraud investigation team. Case on hold pending investigation results.',
      caseId: case5.id,
      authorId: jordan.id,
      createdAt: new Date('2025-12-04T13:15:00Z'),
    },
  });

  console.log('Seeding completed!');
  console.log(`Created ${2} users`);
  console.log(`Created ${5} cases`);
  console.log(`Created ${13} comments`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

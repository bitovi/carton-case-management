import { PrismaClient, ClaimStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (development only)
  console.log('Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('Creating users...');
  const alex = await prisma.user.create({
    data: {
      email: 'alex.morgan@example.com',
      name: 'Alex Morgan',
      password: 'hashed_password_1', // In real app, hash passwords
    },
  });

  const john = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'hashed_password_2',
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: 'hashed_password_3',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson',
      password: 'hashed_password_4',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      password: 'hashed_password_5',
    },
  });

  // Create cases
  console.log('Creating cases...');
  const case1 = await prisma.case.create({
    data: {
      title: 'Insurance Claim Dispute',
      caseNumber: 'CAS-242314-2124',
      description:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      status: ClaimStatus.TO_DO,
      customerName: 'Sarah Johnson',
      createdBy: alex.id,
      assignedTo: alex.id,
      createdAt: new Date('2025-10-24T10:00:00Z'),
      updatedAt: new Date('2025-12-12T15:30:00Z'),
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Policy Coverage Inquiry',
      caseNumber: 'CAS-242315-2125',
      description: 'Customer inquiring about coverage limits for recent home damage claim.',
      status: ClaimStatus.IN_PROGRESS,
      customerName: 'Michael Brown',
      createdBy: john.id,
      assignedTo: jane.id,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Premium Adjustment Request',
      caseNumber: 'CAS-242316-2126',
      description: 'Request to review and adjust premium based on improved credit score.',
      status: ClaimStatus.COMPLETED,
      customerName: 'Emily Davis',
      createdBy: jane.id,
      assignedTo: john.id,
    },
  });

  const case4 = await prisma.case.create({
    data: {
      title: 'Claim Status Update',
      caseNumber: 'CAS-242317-2127',
      description: 'Customer requesting status update on pending auto claim.',
      status: ClaimStatus.TO_DO,
      customerName: 'David Wilson',
      createdBy: alex.id,
      assignedTo: null,
    },
  });

  const case5 = await prisma.case.create({
    data: {
      title: 'Fraud Investigation',
      caseNumber: 'CAS-242318-2128',
      description: 'Suspicious activity detected on policy, requires investigation.',
      status: ClaimStatus.IN_PROGRESS,
      customerName: 'Lisa Anderson',
      createdBy: bob.id,
      assignedTo: alex.id,
    },
  });

  // Create comments
  console.log('Creating comments...');

  // Comments for case 1
  await prisma.comment.create({
    data: {
      content:
        'Initial assessment completed. Customer qualifies for emergency housing assistance. Need to verify income documentation.',
      authorId: alex.id,
      caseId: case1.id,
      createdAt: new Date('2025-11-29T11:55:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Verified income documentation. Customer qualifies for assistance program.',
      authorId: bob.id,
      caseId: case1.id,
      createdAt: new Date('2025-12-01T14:20:00Z'),
    },
  });

  // Comments for case 2
  await prisma.comment.create({
    data: {
      content: 'Reviewed policy documents. Coverage limit is $50,000 for home damage.',
      authorId: jane.id,
      caseId: case2.id,
      createdAt: new Date('2025-12-10T09:30:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Customer notified of coverage limits. Requested additional documentation.',
      authorId: john.id,
      caseId: case2.id,
      createdAt: new Date('2025-12-15T16:45:00Z'),
    },
  });

  // Comments for case 3
  await prisma.comment.create({
    data: {
      content: 'Credit score verified. Premium adjustment approved.',
      authorId: john.id,
      caseId: case3.id,
      createdAt: new Date('2025-12-05T10:00:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Customer notified of new premium rate effective next billing cycle.',
      authorId: jane.id,
      caseId: case3.id,
      createdAt: new Date('2025-12-08T13:20:00Z'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Case closed successfully. Customer satisfied with resolution.',
      authorId: john.id,
      caseId: case3.id,
      createdAt: new Date('2025-12-10T11:00:00Z'),
    },
  });

  // Comments for case 4
  await prisma.comment.create({
    data: {
      content: 'Claim is pending review by underwriting team.',
      authorId: alex.id,
      caseId: case4.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Underwriting requested additional photos of vehicle damage.',
      authorId: bob.id,
      caseId: case4.id,
    },
  });

  // Comments for case 5
  await prisma.comment.create({
    data: {
      content: 'Investigation initiated. Reviewing claim history and documentation.',
      authorId: alex.id,
      caseId: case5.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Found inconsistencies in submitted documents. Escalating to fraud team.',
      authorId: bob.id,
      caseId: case5.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Fraud team conducting detailed review. Expected resolution in 5-7 business days.',
      authorId: alex.id,
      caseId: case5.id,
    },
  });

  console.log('Seed data created successfully!');
  console.log(`Created ${5} users`);
  console.log(`Created ${5} cases`);
  console.log(`Created comments for all cases`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

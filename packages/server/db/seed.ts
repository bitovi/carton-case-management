import { prisma } from '@carton/shared';
import { FIRST_USER_EMAIL } from './constants.js';

async function main() {
  console.log('Clearing existing data...');

  // Delete all existing data in correct order (respecting foreign keys)
  await prisma.comment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create demo users (staff members who use the app)
  const alexMorgan = await prisma.user.create({
    data: {
      email: FIRST_USER_EMAIL,
      name: 'Alex Morgan',
      password: 'hashed_password_here', // In production, use bcrypt
    },
  });

  const jordanDoe = await prisma.user.create({
    data: {
      email: 'jordan.doe@carton.com',
      name: 'Jordan Doe',
      password: 'hashed_password_here',
    },
  });

  const taylorSmith = await prisma.user.create({
    data: {
      email: 'taylor.smith@carton.com',
      name: 'Taylor Smith',
      password: 'hashed_password_here',
    },
  });

  // Create demo customers (people who cases are about)
  const sarahJohnson = await prisma.customer.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      username: 'sarah-johnson',
      email: 'sarahjohnson42@gmail.com',
      satisfactionRate: 4.5,
      dateJoined: new Date('2025-05-04'),
    },
  });

  const johnSorenson = await prisma.customer.create({
    data: {
      firstName: 'John',
      lastName: 'Sorenson',
      username: 'jsorenson',
      email: 'john.sorenson@email.com',
      satisfactionRate: 4.0,
      dateJoined: new Date('2024-08-15'),
    },
  });

  const aliceSmith = await prisma.customer.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'asmith',
      email: 'alice.smith@example.com',
      satisfactionRate: 5.0,
      dateJoined: new Date('2024-03-20'),
    },
  });

  const bobWilliams = await prisma.customer.create({
    data: {
      firstName: 'Bob',
      lastName: 'Williams',
      username: 'bwilliams',
      email: 'bob.w@test.com',
      satisfactionRate: 3.5,
      dateJoined: new Date('2025-01-10'),
    },
  });

  const emilyBrown = await prisma.customer.create({
    data: {
      firstName: 'Emily',
      lastName: 'Brown',
      username: 'ebrown',
      email: 'emily.brown@mail.com',
      satisfactionRate: 4.0,
      dateJoined: new Date('2024-11-05'),
    },
  });

  // Create demo cases with comments
  const case1 = await prisma.case.create({
    data: {
      title: 'Insurance Claim Dispute',
      description:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      customerId: sarahJohnson.id,
      status: 'TO_DO',
      priority: 'HIGH',
      createdBy: alexMorgan.id,
      updatedBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2025-12-28T09:30:00'),
      updatedAt: new Date('2025-12-28T09:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      caseId: case1.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2025-11-29T11:55:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Following up on the housing assistance application. Will contact the Housing First program coordinator.',
      caseId: case1.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2025-11-29T14:30:00'),
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Policy Coverage Inquiry',
      description:
        'Customer inquiring about coverage details for their home insurance policy. Specifically asking about flood damage coverage and deductible amounts.',
      customerId: johnSorenson.id,
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdBy: jordanDoe.id,
      updatedBy: taylorSmith.id,
      assignedTo: taylorSmith.id,
      createdAt: new Date('2025-12-25T14:20:00'),
      updatedAt: new Date('2025-12-25T14:20:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Reviewed policy documents. Flood coverage is included with a $1,000 deductible.',
      caseId: case2.id,
      authorId: taylorSmith.id,
      createdAt: new Date('2025-12-10T09:15:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Sent detailed coverage breakdown to customer via email.',
      caseId: case2.id,
      authorId: taylorSmith.id,
      createdAt: new Date('2025-12-10T10:45:00'),
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Premium Adjustment Request',
      description:
        'Customer requesting premium adjustment after installing new security system. Eligibility for discount needs to be verified.',
      customerId: aliceSmith.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: taylorSmith.id,
      updatedBy: jordanDoe.id,
      assignedTo: jordanDoe.id,
      createdAt: new Date('2025-12-22T11:15:00'),
      updatedAt: new Date('2025-12-22T11:15:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Security system details received. Verifying with approved vendors list.',
      caseId: case3.id,
      authorId: jordanDoe.id,
      createdAt: new Date('2025-12-15T13:20:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'System qualifies for 10% discount. Processing adjustment.',
      caseId: case3.id,
      authorId: jordanDoe.id,
      createdAt: new Date('2025-12-16T11:00:00'),
    },
  });

  const case4 = await prisma.case.create({
    data: {
      title: 'Vehicle Accident Report',
      description:
        'Customer involved in minor vehicle accident. Need to process auto insurance claim and arrange vehicle assessment.',
      customerId: bobWilliams.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdBy: alexMorgan.id,
      updatedBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2025-12-30T08:45:00'),
      updatedAt: new Date('2025-12-30T08:45:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Police report received. Scheduling vehicle inspection for tomorrow.',
      caseId: case4.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2025-12-30T10:20:00'),
    },
  });

  const case5 = await prisma.case.create({
    data: {
      title: 'Billing Discrepancy',
      description:
        'Customer reports being charged incorrect premium amount. Invoice shows $150 but policy agreement states $120.',
      customerId: emilyBrown.id,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      createdBy: jordanDoe.id,
      updatedBy: taylorSmith.id,
      assignedTo: taylorSmith.id,
      createdAt: new Date('2025-12-20T13:00:00'),
      updatedAt: new Date('2025-12-20T13:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Reviewed billing records. Incorrect rate was applied due to system error.',
      caseId: case5.id,
      authorId: taylorSmith.id,
      createdAt: new Date('2025-12-20T14:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Corrected billing and issued $30 credit to customer account. Case resolved.',
      caseId: case5.id,
      authorId: taylorSmith.id,
      createdAt: new Date('2025-12-20T16:15:00'),
    },
  });

  const case6 = await prisma.case.create({
    data: {
      title: 'Policy Renewal Question',
      description:
        'Customer asking about renewal process and whether current coverage limits are still adequate for updated property value.',
      customerId: sarahJohnson.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: jordanDoe.id,
      updatedBy: jordanDoe.id,
      assignedTo: null,
      createdAt: new Date('2025-12-18T10:30:00'),
      updatedAt: new Date('2025-12-18T10:30:00'),
    },
  });

  console.log('Seeding completed!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.customer.count()} customers`);
  console.log(`Created ${await prisma.case.count()} cases`);
  console.log(`Created ${await prisma.comment.count()} comments`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

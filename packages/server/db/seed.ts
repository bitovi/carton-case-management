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

  // Create demo users (staff members who create and manage cases)
  const alexMorgan = await prisma.user.create({
    data: {
      firstName: 'Alex',
      lastName: 'Morgan',
      username: 'alex-morgan',
      email: FIRST_USER_EMAIL,
      password: 'hashed_password_here', // In production, use bcrypt
      dateJoined: new Date('2024-01-15'),
    },
  });

  const sarahJohnson = await prisma.user.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      username: 'sarah-johnson',
      email: 'sarahjohnson42@gmail.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2025-05-04'),
    },
  });

  const johnSorenson = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Sorenson',
      username: 'jsorenson',
      email: 'john.sorenson@email.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-08-15'),
    },
  });

  const aliceSmith = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'asmith',
      email: 'alice.smith@example.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-03-20'),
    },
  });

  const bobWilliams = await prisma.user.create({
    data: {
      firstName: 'Bob',
      lastName: 'Williams',
      username: 'bwilliams',
      email: 'bob.w@test.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2025-01-10'),
    },
  });

  const emilyBrown = await prisma.user.create({
    data: {
      firstName: 'Emily',
      lastName: 'Brown',
      username: 'ebrown',
      email: 'emily.brown@mail.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-11-05'),
    },
  });

  // Create demo customers (people who cases are about)
  const customerMichaelDavis = await prisma.customer.create({
    data: {
      firstName: 'Michael',
      lastName: 'Davis',
      username: 'mdavis',
      email: 'michael.davis@customer.com',
      satisfactionRate: 4.5,
      dateJoined: new Date('2025-05-04'),
    },
  });

  const customerJessicaMiller = await prisma.customer.create({
    data: {
      firstName: 'Jessica',
      lastName: 'Miller',
      username: 'jmiller',
      email: 'jessica.miller@customer.com',
      satisfactionRate: 4.0,
      dateJoined: new Date('2024-08-15'),
    },
  });

  const customerDavidWilson = await prisma.customer.create({
    data: {
      firstName: 'David',
      lastName: 'Wilson',
      username: 'dwilson',
      email: 'david.wilson@customer.com',
      satisfactionRate: 5.0,
      dateJoined: new Date('2024-03-20'),
    },
  });

  const customerLisaAnderson = await prisma.customer.create({
    data: {
      firstName: 'Lisa',
      lastName: 'Anderson',
      username: 'landerson',
      email: 'lisa.anderson@customer.com',
      satisfactionRate: 3.5,
      dateJoined: new Date('2025-01-10'),
    },
  });

  const customerRobertTaylor = await prisma.customer.create({
    data: {
      firstName: 'Robert',
      lastName: 'Taylor',
      username: 'rtaylor',
      email: 'robert.taylor@customer.com',
      satisfactionRate: 4.0,
      dateJoined: new Date('2024-11-05'),
    },
  });

  // Create demo cases with comments
  const case1 = await prisma.case.create({
    data: {
      title: 'Insurance Claim Dispute',
      description:
        'Customer seeking housing assistance after losing their apartment due to job loss. They currently have temporary housing but need permanent housing within 60 days. Income is below the threshold for the Housing First program.',
      customerId: customerMichaelDavis.id,
      status: 'TO_DO',
      priority: 'HIGH',
      createdBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2025-12-28T09:30:00'),
      updatedAt: new Date('2025-12-28T09:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Customer is seeking housing assistance after job loss. Currently in temporary housing. Need to contact Housing First program coordinator.',
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
      authorId: sarahJohnson.id,
      createdAt: new Date('2025-11-29T14:30:00'),
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Policy Coverage Inquiry',
      description:
        'Customer inquiring about coverage details for their home insurance policy. Specifically asking about flood damage coverage and deductible amounts.',
      customerId: customerJessicaMiller.id,
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdBy: sarahJohnson.id,
      assignedTo: sarahJohnson.id,
      createdAt: new Date('2025-12-25T14:20:00'),
      updatedAt: new Date('2025-12-25T14:20:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Reviewed policy documents. Flood coverage is included with a $1,000 deductible.',
      caseId: case2.id,
      authorId: sarahJohnson.id,
      createdAt: new Date('2025-12-10T09:15:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Sent detailed coverage breakdown to customer via email.',
      caseId: case2.id,
      authorId: emilyBrown.id,
      createdAt: new Date('2025-12-10T10:45:00'),
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Premium Adjustment Request',
      description:
        'Customer requesting premium adjustment after installing new security system. Eligibility for discount needs to be verified.',
      customerId: customerDavidWilson.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: johnSorenson.id,
      assignedTo: johnSorenson.id,
      createdAt: new Date('2025-12-22T11:15:00'),
      updatedAt: new Date('2025-12-22T11:15:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Security system details received. Verifying with approved vendors list.',
      caseId: case3.id,
      authorId: johnSorenson.id,
      createdAt: new Date('2025-12-15T13:20:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'System qualifies for 10% discount. Processing adjustment.',
      caseId: case3.id,
      authorId: aliceSmith.id,
      createdAt: new Date('2025-12-16T11:00:00'),
    },
  });

  const case4 = await prisma.case.create({
    data: {
      title: 'Vehicle Accident Report',
      description:
        'Customer involved in minor vehicle accident. Need to process auto insurance claim and arrange vehicle assessment.',
      customerId: customerLisaAnderson.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2025-12-30T08:45:00'),
      updatedAt: new Date('2025-12-30T08:45:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Police report received. Scheduling vehicle inspection for tomorrow.',
      caseId: case4.id,
      authorId: bobWilliams.id,
      createdAt: new Date('2025-12-30T10:20:00'),
    },
  });

  const case5 = await prisma.case.create({
    data: {
      title: 'Billing Discrepancy',
      description:
        'Customer reports being charged incorrect premium amount. Invoice shows $150 but policy agreement states $120.',
      customerId: customerRobertTaylor.id,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      createdBy: aliceSmith.id,
      assignedTo: aliceSmith.id,
      createdAt: new Date('2025-12-20T13:00:00'),
      updatedAt: new Date('2025-12-20T13:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Reviewed billing records. Incorrect rate was applied due to system error.',
      caseId: case5.id,
      authorId: aliceSmith.id,
      createdAt: new Date('2025-12-20T14:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Corrected billing and issued $30 credit to customer account. Case resolved.',
      caseId: case5.id,
      authorId: johnSorenson.id,
      createdAt: new Date('2025-12-20T16:15:00'),
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

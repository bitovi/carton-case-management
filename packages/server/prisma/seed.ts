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
  const alexMorgan = await prisma.user.create({
    data: {
      email: 'alex.morgan@example.com',
      name: 'Alex Morgan',
      password: 'hashed_password_here', // In production, use bcrypt
    },
  });

  const johnDoe = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'hashed_password_here',
    },
  });

  const janeSmith = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: 'hashed_password_here',
    },
  });

  // Create demo cases with comments
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CAS-242314-2124',
      title: 'Insurance Claim Dispute',
      description:
        'Sarah Johnson is a single mother of two children seeking housing assistance after losing her apartment due to job loss. She currently has temporary housing but needs permanent housing within 60 days. Her income is below the threshold for the Housing First program.',
      customerName: 'Sarah Johnson',
      status: 'TO_DO',
      createdBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
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
      caseNumber: 'CAS-242315-2125',
      title: 'Policy Coverage Inquiry',
      description:
        'Customer inquiring about coverage details for their home insurance policy. Specifically asking about flood damage coverage and deductible amounts.',
      customerName: 'Michael Chen',
      status: 'IN_PROGRESS',
      createdBy: johnDoe.id,
      assignedTo: janeSmith.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Reviewed policy documents. Flood coverage is included with a $1,000 deductible.',
      caseId: case2.id,
      authorId: janeSmith.id,
      createdAt: new Date('2025-12-10T09:15:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Sent detailed coverage breakdown to customer via email.',
      caseId: case2.id,
      authorId: janeSmith.id,
      createdAt: new Date('2025-12-10T10:45:00'),
    },
  });

  const case3 = await prisma.case.create({
    data: {
      caseNumber: 'CAS-242316-2126',
      title: 'Premium Adjustment Request',
      description:
        'Customer requesting premium adjustment after installing new security system. Eligibility for discount needs to be verified.',
      customerName: 'Emily Rodriguez',
      status: 'TO_DO',
      createdBy: janeSmith.id,
      assignedTo: johnDoe.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Security system details received. Verifying with approved vendors list.',
      caseId: case3.id,
      authorId: johnDoe.id,
      createdAt: new Date('2025-12-15T13:20:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'System qualifies for 10% discount. Processing adjustment.',
      caseId: case3.id,
      authorId: johnDoe.id,
      createdAt: new Date('2025-12-16T11:00:00'),
    },
  });

  console.log('Seeding completed!');
  console.log(`Created ${await prisma.user.count()} users`);
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

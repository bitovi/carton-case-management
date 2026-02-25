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
  const unitAxiom = await prisma.user.create({
    data: {
      firstName: 'Unit',
      lastName: 'Axiom',
      username: 'unit-axiom',
      email: FIRST_USER_EMAIL,
      password: 'hashed_password_here', // In production, use bcrypt
      dateJoined: new Date('2024-01-15'),
    },
  });

  const veraCircuit = await prisma.user.create({
    data: {
      firstName: 'Vera',
      lastName: 'Circuit',
      username: 'vera-circuit',
      email: 'vera.circuit42@gmail.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2025-05-04'),
    },
  });

  const johnServo = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Servo',
      username: 'jservo',
      email: 'john.servo@email.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-08-15'),
    },
  });

  const aliceMecha = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Mecha',
      username: 'amecha',
      email: 'alice.mecha@example.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-03-20'),
    },
  });

  const bobChronos = await prisma.user.create({
    data: {
      firstName: 'Bob',
      lastName: 'Chronos',
      username: 'bchronos',
      email: 'bob.c@test.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2025-01-10'),
    },
  });

  const emilySynth = await prisma.user.create({
    data: {
      firstName: 'Emily',
      lastName: 'Synth',
      username: 'esynth',
      email: 'emily.synth@mail.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-11-05'),
    },
  });

  // Create demo customers (people who cases are about)
  const customerRoboDavis = await prisma.customer.create({
    data: {
      firstName: 'Robo',
      lastName: 'Davis',
      username: 'robodavis',
      email: 'robo.davis@customer.com',
      satisfactionRate: 4.5,
      dateJoined: new Date('2025-05-04'),
    },
  });

  const customerJexaMiller = await prisma.customer.create({
    data: {
      firstName: 'Jexa',
      lastName: 'Miller',
      username: 'jexa-miller',
      email: 'jexa.miller@customer.com',
      satisfactionRate: 4.0,
      dateJoined: new Date('2024-08-15'),
    },
  });

  const customerDaxWilson = await prisma.customer.create({
    data: {
      firstName: 'Dax',
      lastName: 'Wilson',
      username: 'daxwilson',
      email: 'dax.wilson@customer.com',
      satisfactionRate: 5.0,
      dateJoined: new Date('2024-03-20'),
    },
  });

  const customerLiraAnderson = await prisma.customer.create({
    data: {
      firstName: 'Lira',
      lastName: 'Anderson',
      username: 'lira-anderson',
      email: 'lira.anderson@customer.com',
      satisfactionRate: 3.5,
      dateJoined: new Date('2025-01-10'),
    },
  });

  const customerRexTaylor = await prisma.customer.create({
    data: {
      firstName: 'Rex',
      lastName: 'Taylor',
      username: 'rextaylor',
      email: 'rex.taylor@customer.com',
      satisfactionRate: 4.0,
      dateJoined: new Date('2024-11-05'),
    },
  });

  // Create demo cases with comments
  const case1 = await prisma.case.create({
    data: {
      title: 'Holiday Rush Delay on Servo Kit',
      description:
        'Customer reports late shipment of RX-9 servo kit due to holiday rush. Order placed two weeks ago; tracking shows no movement for 5 days.',
      customerId: customerRoboDavis.id,
      status: 'TO_DO',
      priority: 'HIGH',
      createdBy: unitAxiom.id,
      assignedTo: unitAxiom.id,
      createdAt: new Date('2025-12-28T09:30:00'),
      updatedAt: new Date('2025-12-28T09:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Confirmed holiday surge backlog with carrier. Requested expedited handoff once scanned.',
      caseId: case1.id,
      authorId: unitAxiom.id,
      createdAt: new Date('2025-11-29T11:55:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Followed up with carrier support. Placed a trace request and notified customer.',
      caseId: case1.id,
      authorId: veraCircuit.id,
      createdAt: new Date('2025-11-29T14:30:00'),
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Lost Shipment: Optical Sensor Array',
      description:
        'Customer reports lost shipment of optical sensor array. Tracking shows delivered, but customer did not receive package.',
      customerId: customerJexaMiller.id,
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdBy: veraCircuit.id,
      assignedTo: veraCircuit.id,
      createdAt: new Date('2025-12-25T14:20:00'),
      updatedAt: new Date('2025-12-25T14:20:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Opened carrier investigation and requested proof of delivery.',
      caseId: case2.id,
      authorId: veraCircuit.id,
      createdAt: new Date('2025-12-10T09:15:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Offered replacement shipment pending carrier response.',
      caseId: case2.id,
      authorId: emilySynth.id,
      createdAt: new Date('2025-12-10T10:45:00'),
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Missing Parts in Exo-Arm Order',
      description:
        'Customer received exo-arm assembly kit but missing two torque couplers and one actuator seal.',
      customerId: customerDaxWilson.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: johnServo.id,
      assignedTo: johnServo.id,
      createdAt: new Date('2025-12-22T11:15:00'),
      updatedAt: new Date('2025-12-22T11:15:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Confirmed missing SKUs from packing list. Preparing replacement shipment.',
      caseId: case3.id,
      authorId: johnServo.id,
      createdAt: new Date('2025-12-15T13:20:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Replacement parts allocated in inventory. Dispatch scheduled.',
      caseId: case3.id,
      authorId: aliceMecha.id,
      createdAt: new Date('2025-12-16T11:00:00'),
    },
  });

  const case4 = await prisma.case.create({
    data: {
      title: 'Warranty Claim: Power Core Overheating',
      description:
        'Customer reports overheating on a Gen-4 power core within warranty period. Requests repair or replacement.',
      customerId: customerLiraAnderson.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdBy: unitAxiom.id,
      assignedTo: unitAxiom.id,
      createdAt: new Date('2025-12-30T08:45:00'),
      updatedAt: new Date('2025-12-30T08:45:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Requested diagnostic logs and serial number. Issued RMA pending verification.',
      caseId: case4.id,
      authorId: bobChronos.id,
      createdAt: new Date('2025-12-30T10:20:00'),
    },
  });

  const case5 = await prisma.case.create({
    data: {
      title: 'Late Shipment: Cybernetic Knee Joint',
      description:
        'Customer reports late shipment of cybernetic knee joint. Order stuck at regional hub during holiday rush.',
      customerId: customerRexTaylor.id,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      createdBy: aliceMecha.id,
      assignedTo: aliceMecha.id,
      createdAt: new Date('2025-12-20T13:00:00'),
      updatedAt: new Date('2025-12-20T13:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Carrier confirmed delay. Upgraded to express on next available route.',
      caseId: case5.id,
      authorId: aliceMecha.id,
      createdAt: new Date('2025-12-20T14:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Shipment delivered. Issued goodwill credit for delay.',
      caseId: case5.id,
      authorId: johnServo.id,
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

import { PrismaClient } from '@carton/shared';

const prisma = new PrismaClient({ log: ['error'] });
import { FIRST_USER_EMAIL } from './constants.js';

async function main() {
  console.log('Clearing existing data...');

  await prisma.comment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // ─── bitovi PLAYER SUPPORT AGENTS ───────────────────────────────────────────
  // Alex Morgan: veteran team lead, overloaded after the Patch 14.6 ban wave
  const alexMorgan = await prisma.user.create({
    data: {
      firstName: 'Alex',
      lastName: 'Morgan',
      username: 'alex-morgan',
      email: FIRST_USER_EMAIL,
      password: 'hashed_password_here',
      dateJoined: new Date('2023-03-10'),
    },
  });

  // Sarah Johnson: resigned Feb 2026; her entire ticket queue dumped onto Alex
  const sarahJohnson = await prisma.user.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      username: 'sarah-johnson',
      email: 'sarah.johnson@bitovigames.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2023-06-01'),
    },
  });

  // Marcus Chen: senior agent, handles escalations and competitive integrity
  const marcusChen = await prisma.user.create({
    data: {
      firstName: 'Marcus',
      lastName: 'Chen',
      username: 'mchen',
      email: 'marcus.chen@bitovigames.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2023-09-15'),
    },
  });

  // Priya Patel: escalations specialist, approves large RP refunds and bans
  const priyaPatel = await prisma.user.create({
    data: {
      firstName: 'Priya',
      lastName: 'Patel',
      username: 'ppatel',
      email: 'priya.patel@bitovigames.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-01-08'),
    },
  });

  // Jordan Blake: new hire Mar 2026, handling straightforward tickets
  const jordanBlake = await prisma.user.create({
    data: {
      firstName: 'Jordan',
      lastName: 'Blake',
      username: 'jblake',
      email: 'jordan.blake@bitovigames.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2026-03-01'),
    },
  });

  // Dana Williams: part-time agent, billing and purchase disputes
  const danaWilliams = await prisma.user.create({
    data: {
      firstName: 'Dana',
      lastName: 'Williams',
      username: 'dwilliams',
      email: 'dana.williams@bitovigames.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2024-07-22'),
    },
  });

  // ─── PLAYERS (CUSTOMERS) ──────────────────────────────────────────────────
  // Robert Blackwell / "FeedingMachineX": serial ban appealer, 4 open tickets, 1.5 stars
  const customerBlackwell = await prisma.customer.create({
    data: {
      firstName: 'Robert',
      lastName: 'Blackwell',
      username: 'FeedingMachineX',
      email: 'robert.blackwell@email.com',
      satisfactionRate: 1.5,
      dateJoined: new Date('2022-04-11'),
    },
  });

  // Maria Santos / "StarGuardianMia": account hacked, two related tickets, satisfaction recovering
  const customerSantos = await prisma.customer.create({
    data: {
      firstName: 'Maria',
      lastName: 'Santos',
      username: 'StarGuardianMia',
      email: 'maria.santos@homemail.com',
      satisfactionRate: 3.5,
      dateJoined: new Date('2021-08-30'),
    },
  });

  // Eleanor Hayes / "GrammaLovesLux": elderly player, filed duplicate tickets, never rated
  const customerHayes = await prisma.customer.create({
    data: {
      firstName: 'Eleanor',
      lastName: 'Hayes',
      username: 'GrammaLovesLux',
      email: 'eleanor.hayes@retired.net',
      satisfactionRate: null,
      dateJoined: new Date('2020-11-05'),
    },
  });

  // Team PentaForce / esports org: tournament eligibility dispute, smurfing investigation
  const customerPentaForce = await prisma.customer.create({
    data: {
      firstName: 'Team',
      lastName: 'PentaForce',
      username: 'TeamPentaForce',
      email: 'manager@teamPentaForce.gg',
      satisfactionRate: 4.0,
      dateJoined: new Date('2019-03-14'),
    },
  });

  // Jennifer Okafor / "JinxMainForever": wrongful ban overturned, left a 5-star review
  const customerOkafor = await prisma.customer.create({
    data: {
      firstName: 'Jennifer',
      lastName: 'Okafor',
      username: 'JinxMainForever',
      email: 'j.okafor@personalmail.com',
      satisfactionRate: 5.0,
      dateJoined: new Date('2023-02-19'),
    },
  });

  // David Reyes / "CasualTopLaner": routine player, low-priority tickets only
  const customerReyes = await prisma.customer.create({
    data: {
      firstName: 'David',
      lastName: 'Reyes',
      username: 'CasualTopLaner',
      email: 'david.reyes@outlook.com',
      satisfactionRate: 4.5,
      dateJoined: new Date('2022-10-03'),
    },
  });

  // ─── CORRUPTED DATA ───────────────────────────────────────────────────────
  // BUG 1: satisfactionRate of 7.5 is out-of-range (0–5).
  // renderStars() computes emptyStars = 5 - 7 - 1 = -3, then calls
  // [...Array(-3)] which throws a RangeError and crashes the CustomerInformation component.
  const customerCorruptRating = await prisma.customer.create({
    data: {
      firstName: '🫠 John',
      lastName: 'Smith',
      username: 'jtothesmith',
      email: 'jsmith@broken.io',
      satisfactionRate: 7.5,
      dateJoined: new Date('2025-01-01'),
    },
  });

  // BUG 2: Empty firstName — the customer list and case dropdowns render
  // " NullSummoner" (leading space), and the case detail header shows
  // "  NullSummoner" with a double gap because of `${firstName} ${lastName}`.
  const customerEmptyName = await prisma.customer.create({
    data: {
      firstName: '',
      lastName: '🫣 NullSummoner',
      username: 'NullSummoner',
      email: 'null.summoner@broken.io',
      satisfactionRate: 3.0,
      dateJoined: new Date('2025-06-15'),
    },
  });

  // BUG 3: Absurdly long in-game name — no word-break opportunity causes the
  // sidebar and customer name field in the case detail to overflow horizontally.
  const customerLongName = await prisma.customer.create({
    data: {
      firstName: 'xXx',
      lastName: 'MLGProMontageKingUltraInstinctGodTierChallenger9000NoScopesOnlyBestInTheWorldEUWFeedingMachineDiamond1EloBoostGigaChad',
      username: 'xXxMLGProMontageKing',
      email: 'mlg.longname@overflow.example',
      satisfactionRate: 2.5,
      dateJoined: new Date('2024-09-09'),
    },
  });

  // ─── TICKETS (CASES) ──────────────────────────────────────────────────────
  // === Patch 14.6 ban wave surge: March 2026 ===

  // Ticket 1 – StarGuardianMia account stolen (URGENT, Alex — inherited from Sarah)
  const caseAccountHack = await prisma.case.create({
    data: {
      title: 'Account Compromised - StarGuardianMia',
      description: 'Player reports her League of Legends account was accessed by an unauthorized party on March 14. Champion pool was altered, over 6,200 RP were spent on skins she did not purchase, and her ranked placement was destroyed (Platinum I → Silver III) after 11 intentional losses.',
      customerId: customerSantos.id,
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      createdBy: sarahJohnson.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2026-03-14T07:12:00'),
      updatedAt: new Date('2026-04-02T15:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Player submitted ticket at 6:50 AM. Login history shows IPs from three different countries in a 2-hour window — classic credential-stuffing pattern. Locking account and resetting credentials immediately.',
      caseId: caseAccountHack.id,
      authorId: sarahJohnson.id,
      createdAt: new Date('2026-03-14T07:30:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Account secured. Reviewing all purchases made during the compromise window. Total unauthorized RP spend: 6,200 RP (~$46.50). Escalating to Priya for full RP refund approval — above my threshold.',
      caseId: caseAccountHack.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-03-18T10:05:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'RP refund approved. Also approving LP restoration — reverting her to Platinum I and crediting 40 LP as a goodwill gesture for the ranked damage. Rare case but clearly a victim.',
      caseId: caseAccountHack.id,
      authorId: priyaPatel.id,
      createdAt: new Date('2026-03-20T14:22:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Refund processed. LP restored. Player confirmed receipt and was extremely relieved. Still working through the skin audit — some skins purchased may need to be removed as they were not earned legitimately.',
      caseId: caseAccountHack.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-04-02T15:30:00'),
    },
  });

  // Ticket 2 – StarGuardianMia unauthorized RP purchases (URGENT, Alex — inherited from Sarah)
  const caseUnauthorizedRP = await prisma.case.create({
    data: {
      title: 'Unauthorized RP Purchases - StarGuardianMia',
      description: 'Spin-off from the account compromise ticket. Hacker purchased the entire Ahri skin line (K/DA All Out Ahri Prestige, Star Guardian Ahri, Elderwood Ahri) and three Battle Passes. Credit card on file was charged $89.97. Player wants a full chargeback processed through bitovi, not her bank.',
      customerId: customerSantos.id,
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      createdBy: sarahJohnson.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2026-03-14T08:45:00'),
      updatedAt: new Date('2026-04-01T09:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Second ticket from StarGuardianMia — separating the billing dispute from the account security ticket per protocol. Confirming charges with our payments team.',
      caseId: caseUnauthorizedRP.id,
      authorId: sarahJohnson.id,
      createdAt: new Date('2026-03-14T09:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Payments team confirmed $89.97 in charges during the compromise window. Processing internal refund so player does not need to initiate a chargeback (which would flag her account). Removing the fraudulently acquired skins from the account.',
      caseId: caseUnauthorizedRP.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-03-20T11:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Refund issued. Player verified receipt. She is very stressed managing two open tickets — leaving a note to fast-track the account compromise ticket as well.',
      caseId: caseUnauthorizedRP.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-04-01T09:00:00'),
    },
  });

  // Ticket 3 – FeedingMachineX third cheating ban appeal (HIGH, Alex)
  const caseBanAppeal3 = await prisma.case.create({
    data: {
      title: 'Cheating Ban Appeal #3 - FeedingMachineX',
      description: 'Player is appealing his third permanent ban, this time on a secondary account. The ban was triggered by our script-detection system (Patch 14.6 enforcement wave). Player claims the detection is a false positive and that the ban on his prior accounts was also unfair.',
      customerId: customerBlackwell.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2026-03-15T10:30:00'),
      updatedAt: new Date('2026-04-10T16:45:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Player submitted a 1,400-word appeal. Pulling match data for the flagged account. Third appeal in 18 months — prior two bans were for scripting (confirmed). This wave used updated heuristics.',
      caseId: caseBanAppeal3.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-03-15T10:45:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Match data reviewed: CS/min, camera patterns, and reaction times are statistically outside human range across 47 games. Pattern matches known orbwalking scripts. Not a false positive. Escalating denial to Priya.',
      caseId: caseBanAppeal3.id,
      authorId: marcusChen.id,
      createdAt: new Date('2026-03-22T14:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Appeal denied. Sending formal denial with our evidence summary. Player is now permanently ineligible for account recovery on any account linked to this hardware ID. Closing the loop on all three bans.',
      caseId: caseBanAppeal3.id,
      authorId: priyaPatel.id,
      createdAt: new Date('2026-04-10T16:45:00'),
    },
  });

  // Ticket 4 – FeedingMachineX RP double charge dispute (MEDIUM, unassigned — 6 weeks stale)
  const caseBillingDispute = await prisma.case.create({
    data: {
      title: 'RP Double Charge - FeedingMachineX',
      description: 'Player claims his credit card was charged twice for a 3,250 RP bundle ($24.99 × 2 = $49.98). He purchased RP on Feb 14 and says his bank statement shows two identical charges on the same day.',
      customerId: customerBlackwell.id,
      status: 'TO_DO',
      priority: 'MEDIUM',
      createdBy: sarahJohnson.id,
      assignedTo: null,
      createdAt: new Date('2026-02-18T09:00:00'),
      updatedAt: new Date('2026-02-18T09:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Created per player email. Sarah heading out — leaving unassigned for team pickup. Note: given his ban history, confirm the account was in good standing on Feb 14 before processing any refund.',
      caseId: caseBillingDispute.id,
      authorId: sarahJohnson.id,
      createdAt: new Date('2026-02-18T09:05:00'),
    },
  });

  // Ticket 5 – FeedingMachineX chat-restriction-to-permaban escalation (HIGH, Marcus, CLOSED)
  const caseToxicPermaban = await prisma.case.create({
    data: {
      title: 'Toxic Behavior Permaban Appeal - FeedingMachineX (Account #1)',
      description: 'Player\'s original account received a permanent ban following 14 chat restriction escalations over 8 months. Final trigger: repeated use of slurs against teammates in ranked games. Player claims he was "just trash talking" and wants a final review.',
      customerId: customerBlackwell.id,
      status: 'CLOSED',
      priority: 'HIGH',
      createdBy: marcusChen.id,
      assignedTo: marcusChen.id,
      createdAt: new Date('2026-02-04T11:00:00'),
      updatedAt: new Date('2026-02-28T17:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Reviewed full chat logs across 14 restriction violations. Behavior is unambiguously in violation of community guidelines. The 14-step escalation process was followed correctly. Denial is appropriate.',
      caseId: caseToxicPermaban.id,
      authorId: marcusChen.id,
      createdAt: new Date('2026-02-10T10:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Player acknowledged in a follow-up email but blamed "competitive stress." Ban stands. His account is now also flagged for the hardware ID block. Closing ticket.',
      caseId: caseToxicPermaban.id,
      authorId: marcusChen.id,
      createdAt: new Date('2026-02-28T17:00:00'),
    },
  });

  // Ticket 6 – FeedingMachineX ranked LP rollback complaint (LOW, Dana, COMPLETED)
  const caseRankedRollback = await prisma.case.create({
    data: {
      title: 'Ranked LP Rollback After Split Reset - FeedingMachineX',
      description: 'Player claims the Season 2026 Split 1 soft reset placed him too low (placed Silver II when he ended last split at Platinum III). Requesting manual LP adjustment.',
      customerId: customerBlackwell.id,
      status: 'COMPLETED',
      priority: 'LOW',
      createdBy: danaWilliams.id,
      assignedTo: danaWilliams.id,
      createdAt: new Date('2026-01-10T14:00:00'),
      updatedAt: new Date('2026-01-15T10:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Checked placement algorithm output. Silver II is mathematically correct given his end-of-split MMR (which was dragged down by intentional feeding reports in the final week). No adjustment warranted. Closing.',
      caseId: caseRankedRollback.id,
      authorId: danaWilliams.id,
      createdAt: new Date('2026-01-15T10:00:00'),
    },
  });

  // Ticket 7 – GrammaLovesLux duplicate skin refund ticket (MEDIUM, Jordan, CLOSED)
  const caseHayesDuplicate = await prisma.case.create({
    data: {
      title: 'Skin Refund Request - GrammaLovesLux (Duplicate)',
      description: 'Player submitted two refund requests for the same skin (Elementalist Lux) purchased on March 10. Second ticket arrived via the web form three days after the in-client ticket was already processed.',
      customerId: customerHayes.id,
      status: 'CLOSED',
      priority: 'MEDIUM',
      createdBy: jordanBlake.id,
      assignedTo: jordanBlake.id,
      createdAt: new Date('2026-03-18T13:00:00'),
      updatedAt: new Date('2026-03-25T11:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Player is 81 years old and used both the in-client support form and the web portal because she wasn\'t sure the first one went through. Both tickets are for the same Elementalist Lux refund. Closing this duplicate — original was already resolved.',
      caseId: caseHayesDuplicate.id,
      authorId: jordanBlake.id,
      createdAt: new Date('2026-03-18T13:20:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Her granddaughter called on her behalf to confirm. Very sweet interaction. Player was worried she had broken something. Explained the duplicate situation — all good.',
      caseId: caseHayesDuplicate.id,
      authorId: jordanBlake.id,
      createdAt: new Date('2026-03-25T11:30:00'),
    },
  });

  // Ticket 8 – GrammaLovesLux original skin refund (LOW, Jordan, COMPLETED)
  const caseHayesSkinRefund = await prisma.case.create({
    data: {
      title: 'Skin Refund Request - Elementalist Lux (GrammaLovesLux)',
      description: 'Player purchased Elementalist Lux (3250 RP) thinking it was the base Lux skin. She did not realize it was a Legendary skin and was surprised by the price on her card statement. Requesting a refund token application.',
      customerId: customerHayes.id,
      status: 'COMPLETED',
      priority: 'LOW',
      createdBy: jordanBlake.id,
      assignedTo: jordanBlake.id,
      createdAt: new Date('2026-03-14T15:00:00'),
      updatedAt: new Date('2026-04-05T14:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Spoke with player — she bought the skin while browsing the in-client shop and did not notice the 3250 RP price. She still has all 3 refund tokens available. Applying one token to refund the skin.',
      caseId: caseHayesSkinRefund.id,
      authorId: jordanBlake.id,
      createdAt: new Date('2026-03-15T09:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Refund processed. 3,250 RP returned to account. Player has 2 refund tokens remaining. She was very grateful and said Lux is still her favorite champion — she will save up for the skin again someday.',
      caseId: caseHayesSkinRefund.id,
      authorId: jordanBlake.id,
      createdAt: new Date('2026-04-05T14:00:00'),
    },
  });

  // Ticket 9 – Team PentaForce tournament eligibility dispute (HIGH, Marcus, IN_PROGRESS)
  const caseTournamentEligibility = await prisma.case.create({
    data: {
      title: 'Tournament Eligibility Dispute - Team PentaForce',
      description: 'Esports organization disputes the disqualification of their mid laner from the bitovi-sponsored Regional League. The player was flagged by the Patch 14.6 automated ban wave. Team argues this is a false positive and their season roster is now incomplete 3 weeks before playoffs.',
      customerId: customerPentaForce.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdBy: marcusChen.id,
      assignedTo: marcusChen.id,
      createdAt: new Date('2026-03-15T14:00:00'),
      updatedAt: new Date('2026-04-12T10:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'High-profile ticket — this affects competitive integrity at the regional level. Pulling all match data for the flagged player (IGN: "PentaMidGod"). Coordinating with the Competitive Operations team before making any determination.',
      caseId: caseTournamentEligibility.id,
      authorId: marcusChen.id,
      createdAt: new Date('2026-03-16T09:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'CompOps review complete. The ban was triggered by the automated system but the underlying data is ambiguous — several data points flag as suspicious but none are individually conclusive. Recommending a manual override and conditional reinstatement pending a supervised monitored match series.',
      caseId: caseTournamentEligibility.id,
      authorId: marcusChen.id,
      createdAt: new Date('2026-04-01T11:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Team PentaForce agreed to the monitored match conditions. Supervised play scheduled for April 20. Holding ticket open pending results.',
      caseId: caseTournamentEligibility.id,
      authorId: marcusChen.id,
      createdAt: new Date('2026-04-12T10:00:00'),
    },
  });

  // Ticket 10 – Team PentaForce smurfing investigation (MEDIUM, unassigned)
  const caseSmurfInvestigation = await prisma.case.create({
    data: {
      title: 'Smurfing Investigation - Team PentaForce Roster Accounts',
      description: 'Anonymous report alleges that two Team PentaForce players have been using smurf accounts to practice in low-MMR lobbies, inflating win rates and potentially exposing low-ranked players to non-competitive gameplay. Requires account audit.',
      customerId: customerPentaForce.id,
      status: 'TO_DO',
      priority: 'MEDIUM',
      createdBy: marcusChen.id,
      assignedTo: null,
      createdAt: new Date('2026-04-01T08:00:00'),
      updatedAt: new Date('2026-04-01T08:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Smurfing by pro players is a known issue this split. Need someone to cross-reference the reported account IDs against the team\'s registered roster. Not urgent but should not sit too long given the tournament context.',
      caseId: caseSmurfInvestigation.id,
      authorId: marcusChen.id,
      createdAt: new Date('2026-04-01T08:10:00'),
    },
  });

  // Ticket 11 – JinxMainForever wrongful ban (originally denied, then overturned)
  const caseWrongfulBan = await prisma.case.create({
    data: {
      title: 'Wrongful Permaban Appeal - JinxMainForever',
      description: 'Player received an automated permaban as part of the Patch 14.6 enforcement wave. She has played 2,800 games over 4 years with zero prior violations. The detection system appears to have flagged her for using a third-party overlay (Porofessor) that was incorrectly categorized as a script.',
      customerId: customerOkafor.id,
      status: 'COMPLETED',
      priority: 'HIGH',
      createdBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2026-01-08T10:00:00'),
      updatedAt: new Date('2026-02-20T16:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Initial review by Sarah denied the appeal — the automated system confidence score was 94%. Player pushed back with screenshots of the Porofessor overlay and a detailed timeline. Reopening for manual investigation.',
      caseId: caseWrongfulBan.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-01-20T09:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Deep dive complete. The detection system was incorrectly fingerprinting the Porofessor analytics overlay as script injection. Engineering has confirmed this is a known false-positive pattern affecting ~0.3% of flagged accounts in this wave. Overturning ban immediately.',
      caseId: caseWrongfulBan.id,
      authorId: priyaPatel.id,
      createdAt: new Date('2026-02-14T11:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Ban lifted. Compensated player with 6,500 RP and an exclusive "Wrongfully Banned" icon as a goodwill gesture. Jennifer left a 5-star review and tagged bitovi on social media calling out Alex and Priya by name. Great outcome — terrible start.',
      caseId: caseWrongfulBan.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-02-20T16:00:00'),
    },
  });

  // Ticket 12 – CasualTopLaner ranked placement bug (LOW, Dana, COMPLETED)
  const casePlacementBug = await prisma.case.create({
    data: {
      title: 'Ranked Placement Bug - CasualTopLaner',
      description: 'Player went 7-3 in placement matches but the system placed him in Iron IV instead of his expected Silver range. He provided screenshots of his match history and end screen showing wins. Likely a display bug tied to the Season 2026 rollout.',
      customerId: customerReyes.id,
      status: 'COMPLETED',
      priority: 'LOW',
      createdBy: danaWilliams.id,
      assignedTo: danaWilliams.id,
      createdAt: new Date('2026-02-10T11:00:00'),
      updatedAt: new Date('2026-02-24T14:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Known bug from the Season 2026 ranked rollout — a backend MMR sync issue caused some accounts to display the wrong division. Engineering pushed a fix in Patch 14.3. Manually correcting his rank to Silver III to match his actual MMR.',
      caseId: casePlacementBug.id,
      authorId: danaWilliams.id,
      createdAt: new Date('2026-02-11T10:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Rank corrected. Player confirmed the update in-client. He was relieved — had been telling his friends he\'d "deranked to Iron" and was embarrassed. All good now.',
      caseId: casePlacementBug.id,
      authorId: danaWilliams.id,
      createdAt: new Date('2026-02-24T14:00:00'),
    },
  });

  // Ticket 13 – CasualTopLaner champion refund question (LOW, unassigned)
  const caseChampRefund = await prisma.case.create({
    data: {
      title: 'Champion BE Refund Eligibility - CasualTopLaner',
      description: 'Player purchased Mordekaiser with Blue Essence and now wants to refund him after trying him in a few games. He used his last refund token on a skin 2 years ago. Asking if there is any exception process for BE purchases.',
      customerId: customerReyes.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: danaWilliams.id,
      assignedTo: null,
      createdAt: new Date('2026-03-28T09:00:00'),
      updatedAt: new Date('2026-03-28T09:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Standard policy: BE refunds are not available without a refund token, and tokens are only replenished under exceptional circumstances. Checking if the Mordekaiser rework qualifies as a "major rework exception." Will follow up.',
      caseId: caseChampRefund.id,
      authorId: danaWilliams.id,
      createdAt: new Date('2026-03-28T09:10:00'),
    },
  });

  // Ticket 14 – Unassigned Patch 14.6 false-positive ban from Sarah's queue
  const caseOrphanedBan = await prisma.case.create({
    data: {
      title: 'Patch 14.6 False-Positive Ban - Unreviewed',
      description: 'Player was banned by the Patch 14.6 automated wave. Account has 6 years of history, Honor Level 5, and zero prior punishments. High likelihood of false positive. Created by Sarah before she left — has not been touched since.',
      customerId: customerHayes.id,
      status: 'TO_DO',
      priority: 'MEDIUM',
      createdBy: sarahJohnson.id,
      assignedTo: null,
      createdAt: new Date('2026-03-16T11:30:00'),
      updatedAt: new Date('2026-03-16T11:30:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Created by Sarah on her last day. Flagged as likely false positive. Player has submitted three follow-up emails. Needs urgent pickup — we are 6 weeks past SLA.',
      caseId: caseOrphanedBan.id,
      authorId: sarahJohnson.id,
      createdAt: new Date('2026-03-16T11:35:00'),
    },
  });

  // Ticket 15 – Unassigned RP purchase failure from Sarah's queue (HIGH priority)
  const caseOrphanedRP = await prisma.case.create({
    data: {
      title: 'RP Purchase Failed - Card Charged, RP Not Received',
      description: 'Player was charged $49.99 for a 6,500 RP bundle during a flash sale on Feb 25. The charge went through on his bank statement but the RP never appeared in his account. He has been waiting for a response for over 8 weeks.',
      customerId: customerBlackwell.id,
      status: 'TO_DO',
      priority: 'HIGH',
      createdBy: sarahJohnson.id,
      assignedTo: null,
      createdAt: new Date('2026-02-25T10:00:00'),
      updatedAt: new Date('2026-02-25T10:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Sarah created this on her last day. Flash sale payment failures from Feb 25 were a known batch issue affecting ~200 accounts — there is a spreadsheet in the shared drive. This player needs to be on it. Whoever picks this up, please check the batch fix list first.',
      caseId: caseOrphanedRP.id,
      authorId: sarahJohnson.id,
      createdAt: new Date('2026-02-25T10:05:00'),
    },
  });

  // Ticket 16 – JinxMainForever VALORANT account flag after hack (HIGH, Alex, IN_PROGRESS)
  const caseValorantFlag = await prisma.case.create({
    data: {
      title: 'VALORANT Account Flagged for Suspicious Activity - JinxMainForever',
      description: 'Following the resolution of her LoL wrongful ban, player discovered her linked VALORANT account was also flagged and placed in a restricted matchmaking pool. She never plays VALORANT — the activity was likely from the same attacker who targeted her LoL account in January.',
      customerId: customerOkafor.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2026-04-05T13:00:00'),
      updatedAt: new Date('2026-04-20T09:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'VALORANT anti-cheat flagged the account for 12 games of wallhacking behavior on April 3–4. Player confirms she did not play those sessions. Login IPs from those sessions match the same attacker IPs from the January LoL compromise. Likely same threat actor.',
      caseId: caseValorantFlag.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-04-08T10:00:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'Confirmed with VALORANT anti-cheat team: removing restriction from the matchmaking pool. bitovi account security team is investigating the attacker\'s infrastructure — this may be a credential resale operation targeting multiple players.',
      caseId: caseValorantFlag.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-04-20T09:00:00'),
    },
  });

  // Ticket 17 – StarGuardianMia LP loss dispute escalated to Priya (URGENT)
  const caseLPDispute = await prisma.case.create({
    data: {
      title: 'LP Restoration Appeal - Post-Hack Ranked Damage - StarGuardianMia',
      description: 'Despite receiving LP restoration to Platinum I, player is now arguing that the goodwill LP bonus (+40 LP) was insufficient — she calculates she lost closer to 180 LP across the 11 intentional-loss games. She is requesting a full audit and restoration to Diamond IV, where her MMR projects.',
      customerId: customerSantos.id,
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      createdBy: alexMorgan.id,
      assignedTo: priyaPatel.id,
      createdAt: new Date('2026-04-08T14:00:00'),
      updatedAt: new Date('2026-04-22T11:00:00'),
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Player is correct — I ran a full LP audit. She lost 11 games averaging ~17 LP each = 187 LP total. We restored her to Plat I with +40 LP. The shortfall is ~147 LP. Her pre-hack MMR does project into Diamond IV. Escalating to Priya — this is above my authorization level.',
      caseId: caseLPDispute.id,
      authorId: alexMorgan.id,
      createdAt: new Date('2026-04-08T14:30:00'),
    },
  });
  await prisma.comment.create({
    data: {
      content: 'LP audit confirmed. Authorizing full restoration to Diamond IV (0 LP) as a one-time exception given the severity of the account compromise. This is unprecedented but warranted. Sending player a detailed breakdown so she understands exactly what was restored.',
      caseId: caseLPDispute.id,
      authorId: priyaPatel.id,
      createdAt: new Date('2026-04-22T11:00:00'),
    },
  });

  // ─── CORRUPTED CASES ──────────────────────────────────────────────────────
  // BUG 4: Blank title — renders as an empty link in the CaseList sidebar.
  await prisma.case.create({
    data: {
      title: '',
      description: 'This ticket was submitted via a direct API call that bypassed the in-client form validation. The empty title renders as a ghost/invisible entry in the ticket list sidebar.',
      customerId: customerCorruptRating.id,
      status: 'TO_DO',
      priority: 'MEDIUM',
      createdBy: alexMorgan.id,
      assignedTo: alexMorgan.id,
      createdAt: new Date('2026-03-30T22:00:00'),
      updatedAt: new Date('2026-03-30T22:00:00'),
    },
  });

  // BUG 5: Whitespace-only title — visually identical to Bug 4 from the list
  // but the stored value is not empty. Any !!title guard treats it as present.
  await prisma.case.create({
    data: {
      title: '          ',
      description: 'Title is whitespace-only. Shows as blank in the ticket list but is technically non-empty. Submitted by a bot that spammed the support endpoint during a DDOS attempt on March 31.',
      customerId: customerEmptyName.id,
      status: 'IN_PROGRESS',
      priority: 'LOW',
      createdBy: alexMorgan.id,
      assignedTo: null,
      createdAt: new Date('2026-04-01T03:15:00'),
      updatedAt: new Date('2026-04-01T03:15:00'),
    },
  });

  // BUG 6: Case for the corrupt-rating customer — navigating to this customer
  // from the case detail view will trigger the renderStars RangeError crash.
  await prisma.case.create({
    data: {
      title: 'Account Review Request - CorruptRatingGG',
      description: 'Player filed a routine account review request. Navigating to this player\'s profile will crash the player information component due to an out-of-range satisfactionRate in the database.',
      customerId: customerCorruptRating.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: danaWilliams.id,
      assignedTo: danaWilliams.id,
      createdAt: new Date('2026-04-15T10:00:00'),
      updatedAt: new Date('2026-04-15T10:00:00'),
    },
  });

  // BUG 7: Case for the long-name customer — customer name overflows the
  // sidebar list and the case detail's "Customer Name" field, breaking layout.
  await prisma.case.create({
    data: {
      title: 'Username Policy Violation Review - xXxMLGProMontageKing',
      description: 'Player\'s in-game name was flagged by the username moderation system for excessive length and rule violations. Navigating to this player\'s profile will cause the customer name field and sidebar to overflow horizontally.',
      customerId: customerLongName.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: danaWilliams.id,
      assignedTo: null,
      createdAt: new Date('2026-04-18T09:00:00'),
      updatedAt: new Date('2026-04-18T09:00:00'),
    },
  });

  // BUG 8: Customer with satisfactionRate: -2 (negative out-of-range).
  // renderStars() computes fullStars = Math.floor(-2) = -2, then [...Array(-2)]
  // throws RangeError: Invalid array length — same crash as 7.5 but triggered
  // by a negative value. This player was given a penalty score during a manual
  // data import from a legacy moderation system.
  const customerNegativeRating = await prisma.customer.create({
    data: {
      firstName: '😬 Perma',
      lastName: 'Reported',
      username: 'PermaReported420',
      email: 'perma.reported@broken.io',
      satisfactionRate: -2,
      dateJoined: new Date('2024-05-05'),
    },
  });

  // BUG 9: Support agent with empty firstName.
  // This affects multiple UI surfaces simultaneously:
  //   - Comment avatars: firstName[0] resolves to undefined, so the avatar
  //     shows only the lastName initial instead of two initials (e.g. "G" not "AG")
  //   - "Created By" field in case details: renders " GhostAgent" (leading space)
  //   - "Assigned To" dropdown: label is " GhostAgent" (leading space)
  //   - CreateCasePage "Assign To" dropdown: same leading-space label
  const agentGhost = await prisma.user.create({
    data: {
      firstName: '',
      lastName: 'GhostAgent',
      username: 'ghost-agent',
      email: 'ghost.agent@bitovigames.com',
      password: 'hashed_password_here',
      dateJoined: new Date('2025-11-01'),
    },
  });

  // BUG 10: Case with createdAt timestamp in the far future (year 2099).
  // "Date Opened" in the case detail view shows "January 1, 2099".
  // The case number generated by formatCaseNumber() shows "#CAS-990101-..."
  // (year "99" instead of "26"), which looks like an ancient or corrupted record.
  // Also assigned to agentGhost — both bugs are visible on the same ticket.
  const caseFutureDate = await prisma.case.create({
    data: {
      title: 'Scheduled Account Flag - System Clock Error',
      description: 'This ticket was pre-created by an automated scheduling script that had a misconfigured system clock. The timestamp was set to January 1, 2099 instead of 2026. The "Date Opened" field shows a future date and the case number has year "99".',
      customerId: customerNegativeRating.id,
      status: 'TO_DO',
      priority: 'LOW',
      createdBy: alexMorgan.id,
      assignedTo: agentGhost.id,
      createdAt: new Date('2099-01-01T00:00:00'),
      updatedAt: new Date('2099-01-01T00:00:00'),
    },
  });

  // BUG 11: Comment with empty string content.
  // The comment bubble renders with the author avatar, name, and timestamp
  // but the <p> containing the message body is an empty element — a visible
  // blank gap in the comment thread that looks like a UI rendering failure.
  await prisma.comment.create({
    data: {
      content: '',
      caseId: caseFutureDate.id,
      authorId: agentGhost.id,
      createdAt: new Date('2026-04-01T03:20:00'),
    },
  });

  // Case for the negative-rating customer — opening this ticket and then
  // navigating to the player profile triggers the renderStars RangeError crash.
  // Created by agentGhost so the "Created By" field also shows the leading-space bug.
  await prisma.case.create({
    data: {
      title: 'Toxicity Score Review - PermaReported420',
      description: 'Player has the highest toxicity score in the region. Their satisfactionRate was set to -2 during a legacy moderation data migration. Navigating to this player\'s profile crashes the CustomerInformation component. The "Created By" field on this ticket also shows " GhostAgent" (leading space) due to the ghost agent\'s empty firstName.',
      customerId: customerNegativeRating.id,
      status: 'CLOSED',
      priority: 'HIGH',
      createdBy: agentGhost.id,
      assignedTo: marcusChen.id,
      createdAt: new Date('2026-02-20T09:00:00'),
      updatedAt: new Date('2026-02-20T09:00:00'),
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

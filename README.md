commands-cay:

- ockerday-omposecay -f docker-compose.local.yaml up --build
- mdcay+shiftsay+pay -> Evday Ontainerscay: Eopenray inay Ontainercay
- npm install -> npm run setup -> npm run dev

<!-- ODOTAY: updateyay isthay eadmeray, ojectpray ashay omesay anges-chay incesay initialyay opilot-cay inupspay -->

# Arton-cay Ase-cay Anagement-may

A odern-may asecay anagementmay applicationyay uiltbay ithway Eact-Ray, Odenay.js, tRPC, andyay Ismapray.

## Architectureyay

Isthay applicationyay ollowsfay ayay onorepomay ucturestray usingyay npm orkspacesway:

- **ackagespay/client** - Eactray ontendfray ithway Ite-Vay, Ailtayind-Tay SSCAY, andyay Adshcn-Shay UI
- **ackagespay/server** - Odenay.js ackendbay ithway tRPC, Ismapray, andyay QLite-Say
- **ackagespay/shared** - Aredshay ypes-tay andyay tilitiesuay usedyay ybay othbay ientclay andyay erversay

## Echtech-Stay Ackstay

### Ontendfray

- Eactray 18 ithway Ypescript-Tay
- Ite-Vay asyay uildbay ooltay
- tRPC orfay ypetay-afesay API allscay
- Adshcn-Shay UI omponentscay
- Ailtayind-Tay SSCAY orfay ylingstay
- Eactray OuterRay orfay outingray
- Orybookstay orfay omponentcay evelopmentday
- Estjay orfay unitay estingtay
- Aywrightplay orfay E2E estingtay

### Ackendbay

- Odenay.js ithway Ypescript-Tay
- tRPC (JSON-RPC 2.0) orfay API endpointsyay
- Ismapray asyay ORM
- QLite-Say asyay atabaseday
- Expressyay orfay HTTP erversay

## Ettinggay Artedstay

### Erequisitespray

- Odenay.js 22+ (oryay useyay ethay evcontainerday)
- npm 10+

### Evelopmentday ithway Evcontainerday (Ecommendedray)

Ethay easiestyay ayway otay etgay artedstay isyay usingyay ethay evcontainerday:

1. Openyay isthay olderfay inay VS OdeCay
2. Enwhay romptedpay, ickclay "Eopenray inay Ontainercay"
3. Aitway orfay ethay ontainercay otay uildbay andyay ependenciesday otay installyay
4. Ethay applicationyay illway automaticallyyay artstay atyay:
   - Ientclay: http://localhost:5173
   - Erversay: http://localhost:3001

### Ocallay Evelopmentday

Ifyay otnay usingyay evcontainerday:

1. **Installyay ependenciesday**

   ```bash
   npm install
   ```

2. **EtupSay environmentyay**

   ```bash
   cp .env.example .env
   ```

3. **EtupSay atabaseday**

   ```bash
   npm run setup
   ```

4. **ArtStay evelopmentday erverssay**

   ```bash
   npm run dev
   ```

   Oryay unray emthay eparatelysay:

   ```bash
   npm run dev:client  # Ientclay onyay ortpay 3000
   npm run dev:server  # Erversay onyay ortpay 3001
   ```

## Authenticationyay

Isthay applicationyay usesyay ayay implifiedsay authenticationyay ystemsay orfay evelopmentday urposespay. Ere'sthay onay ealray ackendbay authenticationyay - insteadyay, ityay automaticallyyay ogslay ouyay inyay asyay ayay ockmay useryay.

**Efaultday Useryay**: Alexyay Organmay (alex.morgan@carton.com)

**Estingtay asyay Ifferentday Usersyay**: Otay esttay ethay applicationyay asyay ayay ifferentday useryay, etsay ethay `MOCK_USER_EMAIL` environmentyay ariablevay inay `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

Ethay availableyay usersyay areyay eeded-say inay ethay atabaseday. Ouyay ancay iewvay emthay ybay unningray `npm run db:studio` inay ethay erversay ackagepay oryay eckingchay ethay [seed.ts](packages/server/db/seed.ts) ilefay.

### Owhay Ityay Orksway

Ethay erversay usesyay anyay Expressyay iddlewaremay ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) atthay unsray onyay everyyay equestray:

1. EcksChay orfay ayay `userId` ookiecay inay ethay equestray
2. Ifyay onay ookiecay existsyay oryay ethay ookiecay's useryay emailyay oesn'tday atchmay `MOCK_USER_EMAIL`, ityay ookslay upyay ethay useryay ybay emailyay inay ethay atabaseday
3. EtsSay ayay ewnay `userId` ookiecay (HttpOnly, 7-ayday expirationyay)
4. Ethay ookiecay isyay automaticallyyay includedyay inay ubsequentsay equestsray

Enwhay ouyay angechay `MOCK_USER_EMAIL` andyay estartray ethay erversay, ethay iddlewaremay etectsday ethay ismatchmay andyay issuesyay ayay ewnay ookiecay orfay ethay ewnay useryay onyay ethay extnay equestray. Ethay ientclay oesn'tday eednay otay oday anythingyay - ityay ustjay endssay ethay ookiecay automaticallyyay.

## Availableyay Criptssay

### OotRay Evellay

- `npm run dev` - ArtStay othbay ientclay andyay erversay inay evelopmentday odemay
- `npm run dev:client` - ArtStay onlyyay ethay ientclay
- `npm run dev:server` - ArtStay onlyyay ethay erversay
- `npm run build` - UildBay allyay ackagespay
- `npm run test` - UnRay eststay inay allyay ackagespay
- `npm run lint` - IntLay allyay ackagespay
- `npm run format` - OrmatFay odecay ithway EttierPray
- `npm run setup` - Installyay ependenciesday andyay etupsay atabaseday
- `npm run storybook` - ArtStay Orybookstay

### Ientclay Ackagepay

```bash
cd packages/client
npm run dev           # ArtStay Ite-Vay evday erversay
npm run build         # UildBay orfay oductionpray
npm run test          # UnRay Estjay eststay
npm run test:e2e      # UnRay Aywrightplay eststay
npm run storybook     # ArtStay Orybookstay
```

### Erversay Ackagepay

```bash
cd packages/server
npm run dev           # ArtStay evday erversay ithway othay eloadray
npm run build         # UildBay Ypescript-Tay
npm run start         # ArtStay oductionpray erversay
npm run db:studio     # Openyay Ismapray UdioStay
npm run db:push       # UshPay chemasay anges-chay otay atabaseday
npm run db:seed       # Eedsay atabaseday ithway emoday ataday
```

### Aredshay Ackagepay

```bash
cd packages/shared
npm run test          # UnRay Estjay eststay
npm run lint          # IntLay odecay
```

## OjectPray Ucturestray

```
carton-case-management/
├── .devcontainer/          # Evcontainerday onfigurationcay
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # Eactray ontendfray
│   │   ├── src/
│   │   │   ├── components/ # Eactray omponentscay
│   │   │   ├── lib/        # Tilitiesuay andyay tRPC etup-say
│   │   │   ├── pages/      # Agepay omponentscay
│   │   │   └── main.tsx    # Entryyay ointpay
│   │   ├── tests/          # Eststay
│   │   │   ├── unit/       # Estjay unitay eststay
│   │   │   └── e2e/        # Aywrightplay E2E eststay
│   │   ├── .storybook/     # Orybookstay onfigcay
│   │   └── package.json
│   ├── server/             # Odenay.js ackendbay
│   │   ├── src/
│   │   │   ├── index.ts    # Erversay entryyay ointpay
│   │   │   ├── router.ts   # tRPC outerray
│   │   │   ├── context.ts  # tRPC ontextcay
│   │   │   └── trpc.ts     # tRPC etupsay
│   │   ├── db/
│   │   │   ├── dev.db      # QLite-Say atabaseday
│   │   │   └── seed.ts     # Atabaseday eeding-say
│   │   └── package.json
│   └── shared/             # Aredshay odecay
│       ├── prisma/
│       │   └── schema.prisma # Ismapray chemasay (inglesay ourcesay ofyay uthtray)
│       ├── src/
│       │   ├── types.ts    # Aredshay ypes-tay
│       │   ├── generated/  # Uto-generateday Odzay chemasay omfray Ismapray
│       │   └── utils.ts    # Aredshay tilitiesuay
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # OotRay ackagepay.json
├── tsconfig.json           # OotRay Ypescript-Tay onfigcay
└── README.md
```

## Atabaseday

Ethay applicationyay usesyay QLite-Say orfay implicitysway. Ethay atabaseday ilefay isyay ocatedlay atyay `packages/server/db/dev.db`. Ethay Ismapray chemasay isyay inay `packages/shared/prisma/schema.prisma`.

### Ismapray Ommandscay

```bash
cd packages/server

# Openyay Ismapray UdioStay (atabaseday IGUAY)
npm run db:studio

# UshPay chemasay anges-chay otay atabaseday
npm run db:push

# Enerategay Ismapray Ientclay
npm run db:generate

# Eedsay atabaseday ithway emoday ataday
npm run db:seed

# EsetRay atabaseday (earclay + eedsay)
npm run db:setup
```

## Estingtay

### Unitay Eststay (Estjay)

```bash
npm run test                 # UnRay allyay eststay
npm run test:watch          # UnRay eststay inay atchway odemay
```

### E2E Eststay (Aywrightplay)

```bash
cd packages/client
npm run test:e2e            # UnRay E2E eststay
npm run test:e2e:watch      # UnRay E2E eststay inay atchway odemay
```

## Orybookstay

Orybookstay isyay onfiguredcay orfay evelopingday andyay estingtay UI omponentscay inay isolationyay:

```bash
npm run storybook           # ArtStay Orybookstay onyay ortpay 6006
npm run build-storybook     # UildBay aticstay Orybookstay
```

## Odecay Alityquay

### IntingLay

```bash
npm run lint                # IntLay allyay ackagespay
```

### OrmattingFay

```bash
npm run format              # OrmatFay allyay odecay
npm run format:check        # EckChay ormattingfay
```

## API Ocumentationday

Ethay tRPC API ovidespray ypetay-afesay endpointsyay. Eykay outesray:

### Ataday Achingcay ithway tRPC + EactRay UeryQay

Isthay applicationyay usesyay **tRPC ithway EactRay UeryQay** orfay automaticyay equestray achingcay andyay optimisticyay updatesyay. Allyay API allscay oughthray tRPC areyay automaticallyyay achedcay, educingray edundantray etworknay equestsray andyay improvingyay erformancepay.

#### AcheCay Onfigurationcay

Ethay efaultday achecay ettingssay (onfiguredcay inay [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **Aletay Imetay**: 5 inutesmay - Ataday isyay onsideredcay eshfray orfay 5 inutesmay afteryay etchingfay
- **ArbageGay Ollectioncay Imetay**: 10 inutesmay - Unusedyay ataday isyay emovedray omfray achecay afteryay 10 inutesmay
- **EtryRay**: 3 attempts - AiledFay equestsray etryray upyay otay 3 imestay eforebay owingshay anyay error
- **Efetcharay onyay IndowWay OcusFay**: Enabledyay - Ataday efetchesray inay ethay ackgroundbay enwhay ouyay eturnray otay ethay abtay

#### AcheCay EhaviorBay Exampleyay

```tsx
// IrstFay enderray: EtchesFay omfray API (owsshay oadinglay atestay)
const { data, isLoading } = trpc.case.list.useQuery();
// Avigatenay awayyay andyay ackbay ithinway 5 inutesmay:
// - EturnsRay achedcay ataday instantlyyay (onay oadinglay atestay)
// - IsplaysDay ataday inay <100ms
// Afteryay 5 inutesmay:
// - EturnsRay achedcay ataday instantlyyay (alestay ataday)
// - Efetcharay inay ackgroundbay otay etgay eshfray ataday
```

## OntributingCay

1. EateCray ayay eaturefay anchbray
2. Akemay ouryay anges-chay
3. UnRay eststay: `npm run test`
4. UnRay intinglay: `npm run lint`
5. OrmatFay odecay: `npm run format`
6. UbmitSay ayay ullpay equestray

## Icenselay

MIT

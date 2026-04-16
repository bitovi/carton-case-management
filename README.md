commandsway:

- ockerdway-composeay -fway ocker-compose.local.yamlday upway --uildbay
- cmdway+iftshay+pway -> evDay ontainersCay: eopenRay inway ontainerCay
- npmway installway -> npmway unray etupSay -> npmway unray evday

<!-- TODO: udpdate this readme, project has some changes since initial copilot spinup -->

# artonCay aseCay anagementMay

Away odernmay asecay anagementmay applicationway uiltbay ithway eactRay, odeNay.jsway, PCRtay, andway ismaPray.

## Architectureway

Isthay applicationway ollowsfay away onorepoMay uctureStay usingway npmway orkspacesWay:

- **ackagespay/lientcay** - eactRay ontendfray ithway iteVay, ailwindTay SSCay, andway adcnShay IUay
- **ackagespay/erversay** - odeNay.jsway ackenbay ithway PCRtay, ismaPray, andway SQLiteay
- **ackagespay/aredsShay** -aredShay ypestay andway utilitiesway usedway ybay othbay lientcay andway erversay

## echTay ackStay

### ontendfray

- eactRay 18way ithway TypeScriptway
- iteVay asway uildbay ooltay
- PCRtay orfay ypetay-afesay APIway allscay
- adcnShay IUay omponentsway
- ailwindTay SSCay orfay ylingstay
- eactRay outerRay orfay outingray
- orybookStay orfay omponentcay evelopmentDay
- estJay orfay unitway estingtay
- laywrightPay orfay E2Eway estingtay

### ackenbay

- odeNay.jsway ithway TypeScriptway
- PCRtay (JSON-RPC 2.0) orfay APIway endpointsway
- ismaPray asway ORMway
- SQLiteay asway atabaseDay
- xpressEay orfay HTTPway erversay

## ettingGay tartedSay

### equisitesPray

- odeNay.jsway 22+ (orway useay ethay evcontainerday)
- npmway 10+

### evelopmentDay ithway evcontainerDay (ecommendedRay)

eThay easiestway ayway otay etgay tartedSay isway usingway ethay evcontainerday:

1. penOay isthay olderFay inway SVay odeCay
2. henWay rompedPay, ickClay "eopenRay inway ontainerCay"
3. aitWay orfay ethay ontainercay otay uildbay andway ependenciesDay otay installway
4. eThay applicationway illway automaticallyway tartsay atway:
   - lientCay: http://localhost:5173
   - erverSay: http://localhost:3001

### ocalLay evelopmentDay

Ifway otNay usingway evcontainerday:

1. **stallInay ependenciesDay**

   ```bash
   npm install
   ```

2. **etupSay environmentway**

   ```bash
   cp .env.example .env
   ```

3. **etupSay atabaseDay**

   ```bash
   npm run setup
   ```

4. **tartSay evelopmentDay erversSay**

   ```bash
   npm run dev
   ```

   Orway unray emthay aratelySepay:

   ```bash
   npm run dev:client  # lientCay onway ortpay 3000
   npm run dev:server  # erverSay onway ortpay 3001
   ```

## Authenticationway

Isthay applicationway usesway away implifiedsay authenticationway ystemsay orfay evelopmentday urposespay. ereTHay isway onay ealray ackenbay authenticationway - insteadway, itway automaticallyway ogslay ouyay inway asway away ockmay userway.

**efaultDay serUay**: lexAay organMay (alex.morgan@carton.com)

**estingTay asway ifferentDay sersUay**: oTay esttay ethay applicationway asway away ifferentday userway, etsay ethay `MOCK_USER_EMAIL` environmentway ariablevay inway `packages/server/.env`:

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

eThay availableway usersway areway eededsay inway ethay atabaseday. ouYay ancay iewvay emthay ybay unningray `npm run db:studio` inway ethay erversay ackagepay orway eckingchay ethay [seed.ts](packages/server/db/seed.ts) ilefay.

### owHay Itway orksWay

eThay erversay usesway anway xpressEay iddlewaremay ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) atthay unsray onway everyvay equestrray:

1. hecksChay orfay away `userId` ookiecay inway ethay equestrray
2. Ifway onay ookiecay existsway orway ethay ookiecay's userway emailway oesnday't atchmay `MOCK_USER_EMAIL`, itway ookslooay upway ethay userway ybay emailway inway ethay atabaseday
3. etsSay away ewnay `userId` ookiecay (HttpOnly, 7-ayDay expirationway)
4. eThay ookiecay isway automaticallyway includedway inway ubsequentsay equestsray

henWay ouyay angechay `MOCK_USER_EMAIL` andway estartray ethay erversay, ethay iddlewaremay etectsday ethay ismatchmay andway issuesway away ewnay ookiecay orfay ethay ewnay userway onway ethay extnay equestrray. eThay lientcay oesnday't eedNay otay oday anythingway - itway ustjay endssay ethay ookiecay automaticallyway.

## Availableway riptsSCay

### ootRay evelLay

- `npm run dev` - tartSay othbay lientcay andway erversay inway evelopmentday odemay
- `npm run dev:client` - tartSay onlyway ethay lientcay
- `npm run dev:server` - tartSay onlyway ethay erversay
- `npm run build` - uildBay allway ackagespay
- `npm run test` - unRay estsStay inway allway ackagespay
- `npm run lint` - intLay allway ackagespay
- `npm run format` - ormatFay odecay ithway rettierPay
- `npm run setup` - stallInay ependenciesDay andway etupSay atabaseDay
- `npm run storybook` - tartSay orybookStay

### lientCay ackagePay

```bash
cd packages/client
npm run dev           # tartSay iteVay evday erversay
npm run build         # uildBay orfay roductionpay
npm run test          # unRay estJay estsStay
npm run test:e2e      # unRay laywrightPay estsStay
npm run storybook     # tartSay orybookStay
```

### erverSay ackagePay

```bash
cd packages/server
npm run dev           # tartSay evday erversay ithway othay eloadray
npm run build         # uildBay TypeScriptway
npm run start         # tartSay roductionpay erversay
npm run db:studio     # penOay ismaPray tudioStay
npm run db:push       # ushPay emaschay angeschay otay atabaseday
npm run db:seed       # eedSay atabaseday ithway emodemoay ataDy
```

### aredShay ackagePay

```bash
cd packages/shared
npm run test          # unRay estJay estsStay
npm run lint          # intLay odecay
```

## rojectPay uctureStray

```
carton-case-management/
├── .devcontainer/          # evcontainerDay onfigurationcay
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # eactRay ontendfray
│   │   ├── src/
│   │   │   ├── components/ # eactRay omponentscay
│   │   │   ├── lib/        # tilitiesUay andway PCRtay etupSay
│   │   │   ├── pages/      # agePay omponentscay
│   │   │   └── main.tsx    # ntryEay ointpay
│   │   ├── tests/          # estsStay
│   │   │   ├── unit/       # estJay unitway estsStay
│   │   │   └── e2e/        # laywrightPay E2Eway estsStay
│   │   ├── .storybook/     # orybookStay onfigcay
│   │   └── package.json
│   ├── server/             # odeNay.jsway ackenbay
│   │   ├── src/
│   │   │   ├── index.ts    # erverSay ntryEay ointpay
│   │   │   ├── router.ts   # PCRtay outerray
│   │   │   ├── context.ts  # PCRtay ontextcay
│   │   │   └── trpc.ts     # PCRtay etupSay
│   │   ├── db/
│   │   │   ├── dev.db      # SQLiteay atabaseDay
│   │   │   └── seed.ts     # atabaseDay eedingsay
│   │   └── package.json
│   └── shared/             # aredShay odecay
│       ├── prisma/
│       │   └── schema.prisma # ismaPray emaschay (ingleSay ourcesay ofway ruthtay)
│       ├── src/
│       │   ├── types.ts    # aredShay ypestay
│       │   ├── generated/  # utoway-eneratedgay odZay emaschay omfray ismaPray
│       │   └── utils.ts    # aredShay utilitiesway
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # ootRay package.jsonway
├── tsconfig.json           # ootRay TypeScriptway onfigcay
└── README.md
```

## atabaseDay

eThay applicationway usesway SQLiteay orfay implicitySay. eThay atabaseday ilefay isway ocatedlay atway `packages/server/db/dev.db`. eThay ismaPray emaschay isway inway `packages/shared/prisma/schema.prisma`.

### ismaPray ommandsCay

```bash
cd packages/server

# penOay ismaPray tudioStay (atabaseday GUIway)
npm run db:studio

# ushPay emaschay angeschay otay atabaseday
npm run db:push

# enerateGay ismaPray lientCay
npm run db:generate

# eedSay atabaseday ithway emodemoay ataDy
npm run db:seed

# esetRay atabaseday (learcay + eedsay)
npm run db:setup
```

## estingTay

### unitway estsStay (estJay)

```bash
npm run test                 # unRay allway estsStay
npm run test:watch          # unRay estsStay inway atchway odemay
```

### E2Eway estsStay (laywrightPay)

```bash
cd packages/client
npm run test:e2e            # unRay E2Eway estsStay
npm run test:e2e:watch      # unRay E2Eway estsStay inway atchway odemay
```

## orybookStay

orybookStay isway onfiguredcay orfay evelopingday andway estingtay IUay omponentscay inway isolationway:

```bash
npm run storybook           # tartSay orybookStay onway ortpay 6006
npm run build-storybook     # uildBay atictsSay orybookStay
```

## odeCay ualityQay

### intingLay

```bash
npm run lint                # intLay allway ackagespay
```

### ormattingFay

```bash
npm run format              # ormatFay allway odecay
npm run format:check        # eckChay ormattingfay
```

## APIway ocumentationDay

eThay PCRtay APIway rovidesplay ypetay-afesay endpointsway. eyKay outesray:

### ataDay achingCay ithway PCRtay + eactRay ueryQay

Isthay applicationway usesway **PCRtay ithway eactRay ueryQay** orfay automaticway equestrray achingcay andway optimisticway updatesway. Allway APIway allscay oughthray PCRtay areway automaticallyway achedcay, educingray edundantray etworkNay equestsray andway improvingway erformancepay.

#### acheCay onfigurationCay

eThay efaultday acheCay ettingssay (onfiguredcay inway [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)):

- **taleSay imesTay**: 5 inutesmay - ataDay isway onsideredcay eshfray orfay 5 inutesmay afterway etchingfay
- **arbageGay ollectionCay imesTay**: 10 inutesmay - nusedUay ataDay isway emovedray omfray acheCay afterway 10 inutesmay
- **etryRay**: 3 attemptsway - ailedFay equestsray etryray upway otay 3 imestay eforebay owingshay anway errorway
- **efetchRay onway indowWay ocusFay**: nabledEay - ataDay efetchesray inway ethay ackgroundbay henway ouyay eturnray otay ethay abtay

#### acheCay ehaviorBay xampleEay

```tsx
// irstFay enderray: etchesFay omfray APIway (owsshay oadinglay tasteStay)
const { data, isLoading } = trpc.case.list.useQuery();

// avigateNay awayway andway ackbay ithinway 5 inutesmay:
// - eturnsRay achedcay ataDay instantlyway (onay oadinglay tasteStay)
// - isplaysDay ataDay inway <100msway

// fterAay 5 inutesmay:
// - eturnsRay achedcay ataDay instantlyway (taleSay ataDay)
// - efetchesRay inway ackgroundbay otay etgay eshfray ataDay
```

#### usingUay eactRay ueryQay evToolsDay

Inway evelopmentday odemay, eactRay ueryQay evToolsDay appearway inway ethay ottombay-ightray ornercay:

1. ickClay ethay evtoolsday iconway otay openway
2. iewVay allway achedcay queriesway andway eirthay tatussay
3. nspectIay ueryQay ataDay, etchfay tatussay, andway acheCay imingstay
4. anuallyMay invalidateway orway efetchray queriesway orfay estingtay

**oteNay**: evToolsDay onlyway appearway inway evelopmentday odemay (`npm run dev`), otNay inway roductionpay uildsbay.

#### acheCay nvalidationIay

henWay ouyay utateMay ataDay (eatecray, updateway, eleteDday), ethay acheCay automaticallyway updatesway:

```tsx
const utils = trpc.useUtils();

// fterAay eatingcray away asecay, invalidateway ethay istlay ueryQay
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // Isthay efetchesray ethay asecay istlay
    utils.case.list.invalidate();
  },
});
```

#### erformancePay enefitsBay

- **nstantIay avigationNay**: achedCay ataDay appearsway inway <100msway henway avigatingnay ackbay otay away agepay
- **educedRay erversay oadLay**: ueriesQay ithinway taleSay imetay (5 inMay) onday't ithay ethay erversay
- **ackgroundBay updatesway**: taleSay ataDay isway updatedway ansparentlytray ithoutway oadinglay atesstay
- **utomaticAay eduplicationDay**: ultipleMany omponentscay usingway ethay ameSay ueryQay areshay oneWay etworkNay equestrray

---

### ataDay etchingFay ithway PCRtay + eactRay ueryQay

Allway examplesway elowbay useay ethay PCRtay lientcay onfiguredcay ithway eactRay ueryQay orfay automaticway achingcay andway ateStay anagementmay.

#### asicBay ueryQay xampleEay

```tsx
import { trpc } from '../lib/trpc';

function CaseList() {
  const { data, isLoading, error } = trpc.case.list.useQuery();

  if (isLoading) return <div>oadingLay...</div>;
  if (error) return <div>rrorEay: {error.message}</div>;

  return (
    <ul>
      {data.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
```

#### ueryQay ithway arametersPlay

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },
    {
      // ustomCay optionsway orfay isthay ueryQay
      staleTime: 1000 * 60, // eshFray orfay 1 inutemay
      enabled: !!status, // onlyOway unray ifway tatussay isway rovidedpay
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### utationMay xampleEay ithway acheCay nvalidationIay

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      // efetchRay ethay asecay istlay otay owShay ewnay asecay
      utils.case.list.invalidate();
    },
    onError: (error) => {
      alert(`ailedFay otay eatecray asecay: ${error.message}`);
    },
  });

  const handleSubmit = (data: { title: string; description: string }) => {
    createCase.mutate({
      title: data.title,
      description: data.description,
      createdBy: currentUserId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ormfay ieldsfay */}
      <button type="submit" disabled={createCase.isLoading}>
        {createCase.isLoading ? 'eatingCray...' : 'eateCray aseCay'}
      </button>
    </form>
  );
}
```

#### ptimisticOay pdatesUay

```tsx
function UpdateCaseStatus({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();

  const updateStatus = trpc.case.update.useMutation({
    onMutate: async (newData) => {
      // ancelCay outgoingway efetchesray
      await utils.case.getById.cancel({ id: caseId });

      // napshotSay reviousPay alueVay
      const previousCase = utils.case.getById.getData({ id: caseId });

      // ptimisticallyOay updateway otay ethay ewnay alueVay
      utils.case.getById.setData({ id: caseId }, (old) =>
        old ? { ...old, status: newData.status } : old
      );

      return { previousCase };
    },
    onError: (err, newData, context) => {
      // ollbackRay onway errorway
      utils.case.getById.setData({ id: caseId }, context?.previousCase);
    },
    onSettled: () => {
      // Alwaysway efetchray afterway errorway orway uccessSay
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  return (
    <button onClick={() => updateStatus.mutate({ id: caseId, status: 'CLOSED' })}>
      oseClay aseCay
    </button>
  );
}
```

#### estingTay atternsPay

henWay estingtay omponentscay atthay useay PCRtay queriesway, useay ethay esttay utilitiesway omfray `src/test/utils.ts`:

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('isplaysDay asescay omfray APIway', async () => {
  // ockMay ethay APIway esponseray
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'estTay aseCay', description: 'estTay', status: 'OPEN' }],
        },
      });
    })
  );

  // enderRay omponentcay ithway PCRtay oviderPray
  const { getByText } = renderWithTrpc(<CaseList />);

  // aitWay orfay ataDay otay oadLay
  await waitFor(() => {
    expect(getByText('estTay aseCay')).toBeInTheDocument();
  });
});
```

orfay oremay examplesway, eesay:

- [ueryQay atternsPay](specs/001-trpc-react-query/contracts/query-example.tsx)
- [utationMay atternsPay](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [estTay atternsPay](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [uickstartQay uideGay](specs/001-trpc-react-query/quickstart.md)

### ealthHay

- `health.query()` - eckChay APIway ealthhay

### sersUay

- `user.list.query()` - etGay allway usersway
- `user.getById.query({ id })` - etGay userway ybay IDway

### asesCay

- `case.list.query({ status?, assignedTo? })` - etGay asescay ithway iltersfay
- `case.getById.query({ id })` - etGay asecay ybay IDway
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - eateCray asecay
- `case.update.mutation({ id, ...updates })` - pdateUay asecay
- `case.delete.mutation({ id })` - eleteDday asecay

## ontributingCay

1. eateCray away eaturefay anchbray
2. akeMay ouryay angeschay
3. unRay estsStay: `npm run test`
4. unRay intinglay: `npm run lint`
5. ormatFay odecay: `npm run format`
6. ubmitSay away ullPay equestrray

## icenseLay

ITMay

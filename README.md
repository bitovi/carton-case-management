commandes:

- docker-compose -f docker-compose.local.yaml up --build
- cmd+shift+p -> Dev Containers: Reopen in Container
- npm install -> npm run setup -> npm run dev

<!-- TODO: mettre à jour ce readme, le projet a subi des modifications depuis le démarrage initial avec Copilot -->

# Carton Case Management

Une application moderne de gestion de dossiers construite avec React, Node.js, tRPC et Prisma.

## Architecture

Cette application suit une structure monorepo utilisant les espaces de travail npm :

- **packages/client** - Frontend React avec Vite, Tailwind CSS et Shadcn UI
- **packages/server** - Backend Node.js avec tRPC, Prisma et SQLite
- **packages/shared** - Types et utilitaires partagés utilisés par le client et le serveur

## Stack Technique

### Frontend

- React 18 avec TypeScript
- Vite comme outil de build
- tRPC pour les appels API typés
- Composants Shadcn UI
- Tailwind CSS pour le style
- React Router pour la navigation
- Storybook pour le développement de composants
- Jest pour les tests unitaires
- Playwright pour les tests E2E

### Backend

- Node.js avec TypeScript
- tRPC (JSON-RPC 2.0) pour les endpoints API
- Prisma comme ORM
- SQLite comme base de données
- Express pour le serveur HTTP

## Démarrage

### Prérequis

- Node.js 22+ (ou utiliser le devcontainer)
- npm 10+

### Développement avec Devcontainer (Recommandé)

La façon la plus simple de commencer est d'utiliser le devcontainer :

1. Ouvrez ce dossier dans VS Code
2. Lorsque demandé, cliquez sur « Reopen in Container »
3. Attendez que le conteneur soit construit et les dépendances installées
4. L'application démarrera automatiquement à :
   - Client : http://localhost:5173
   - Serveur : http://localhost:3001

### Développement Local

Sans devcontainer :

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Configurer l'environnement**

   ```bash
   cp .env.example .env
   ```

3. **Configurer la base de données**

   ```bash
   npm run setup
   ```

4. **Démarrer les serveurs de développement**

   ```bash
   npm run dev
   ```

   Ou les lancer séparément :

   ```bash
   npm run dev:client  # Client sur le port 3000
   npm run dev:server  # Serveur sur le port 3001
   ```

## Authentification

Cette application utilise un système d'authentification simplifié à des fins de développement. Il n'y a pas de véritable authentification backend — à la place, elle vous connecte automatiquement en tant qu'utilisateur fictif.

**Utilisateur par défaut** : Alex Morgan (alex.morgan@carton.com)

**Tester avec différents utilisateurs** : Pour tester l'application en tant qu'autre utilisateur, définissez la variable d'environnement `MOCK_USER_EMAIL` dans `packages/server/.env` :

```env
MOCK_USER_EMAIL=jordan.doe@carton.com
```

Les utilisateurs disponibles sont semés dans la base de données. Vous pouvez les consulter en exécutant `npm run db:studio` dans le package serveur ou en consultant le fichier [seed.ts](packages/server/db/seed.ts).

### Fonctionnement

Le serveur utilise un middleware Express ([autoLogin.ts](packages/server/src/middleware/autoLogin.ts)) qui s'exécute à chaque requête :

1. Vérifie la présence d'un cookie `userId` dans la requête
2. Si aucun cookie n'existe ou si l'email de l'utilisateur du cookie ne correspond pas à `MOCK_USER_EMAIL`, il recherche l'utilisateur par email dans la base de données
3. Définit un nouveau cookie `userId` (HttpOnly, expiration 7 jours)
4. Le cookie est automatiquement inclus dans les requêtes suivantes

Lorsque vous modifiez `MOCK_USER_EMAIL` et redémarrez le serveur, le middleware détecte la discordance et émet un nouveau cookie pour le nouvel utilisateur à la prochaine requête. Le client n'a rien à faire — il envoie simplement le cookie automatiquement.

## Scripts Disponibles

### Niveau Racine

- `npm run dev` - Démarrer le client et le serveur en mode développement
- `npm run dev:client` - Démarrer uniquement le client
- `npm run dev:server` - Démarrer uniquement le serveur
- `npm run build` - Construire tous les packages
- `npm run test` - Exécuter les tests dans tous les packages
- `npm run lint` - Linter tous les packages
- `npm run format` - Formater le code avec Prettier
- `npm run setup` - Installer les dépendances et configurer la base de données
- `npm run storybook` - Démarrer Storybook

### Package Client

```bash
cd packages/client
npm run dev           # Démarrer le serveur de développement Vite
npm run build         # Construire pour la production
npm run test          # Exécuter les tests Jest
npm run test:e2e      # Exécuter les tests Playwright
npm run storybook     # Démarrer Storybook
```

### Package Serveur

```bash
cd packages/server
npm run dev           # Démarrer le serveur de développement avec rechargement à chaud
npm run build         # Compiler TypeScript
npm run start         # Démarrer le serveur de production
npm run db:studio     # Ouvrir Prisma Studio
npm run db:push       # Pousser les changements de schéma vers la base de données
npm run db:seed       # Peupler la base de données avec des données de démonstration
```

### Package Partagé

```bash
cd packages/shared
npm run test          # Exécuter les tests Jest
npm run lint          # Linter le code
```

## Structure du Projet

```
carton-case-management/
├── .devcontainer/          # Configuration du devcontainer
│   ├── devcontainer.json
│   └── Dockerfile
├── packages/
│   ├── client/             # Frontend React
│   │   ├── src/
│   │   │   ├── components/ # Composants React
│   │   │   ├── lib/        # Utilitaires et configuration tRPC
│   │   │   ├── pages/      # Composants de page
│   │   │   └── main.tsx    # Point d'entrée
│   │   ├── tests/          # Tests
│   │   │   ├── unit/       # Tests unitaires Jest
│   │   │   └── e2e/        # Tests E2E Playwright
│   │   ├── .storybook/     # Configuration Storybook
│   │   └── package.json
│   ├── server/             # Backend Node.js
│   │   ├── src/
│   │   │   ├── index.ts    # Point d'entrée du serveur
│   │   │   ├── router.ts   # Routeur tRPC
│   │   │   ├── context.ts  # Contexte tRPC
│   │   │   └── trpc.ts     # Configuration tRPC
│   │   ├── db/
│   │   │   ├── dev.db      # Base de données SQLite
│   │   │   └── seed.ts     # Peuplement de la base de données
│   │   └── package.json
│   └── shared/             # Code partagé
│       ├── prisma/
│       │   └── schema.prisma # Schéma Prisma (source de vérité unique)
│       ├── src/
│       │   ├── types.ts    # Types partagés
│       │   ├── generated/  # Schémas Zod auto-générés depuis Prisma
│       │   └── utils.ts    # Utilitaires partagés
│       └── package.json
├── docker-compose.dev.yaml
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json            # package.json racine
├── tsconfig.json           # Configuration TypeScript racine
└── README.md
```

## Base de Données

L'application utilise SQLite pour sa simplicité. Le fichier de base de données se trouve à `packages/server/db/dev.db`. Le schéma Prisma est dans `packages/shared/prisma/schema.prisma`.

### Commandes Prisma

```bash
cd packages/server

# Ouvrir Prisma Studio (interface graphique de base de données)
npm run db:studio

# Pousser les changements de schéma vers la base de données
npm run db:push

# Générer le client Prisma
npm run db:generate

# Peupler la base de données avec des données de démonstration
npm run db:seed

# Réinitialiser la base de données (effacer + repeupler)
npm run db:setup
```

## Tests

### Tests Unitaires (Jest)

```bash
npm run test                 # Exécuter tous les tests
npm run test:watch          # Exécuter les tests en mode surveillance
```

### Tests E2E (Playwright)

```bash
cd packages/client
npm run test:e2e            # Exécuter les tests E2E
npm run test:e2e:watch      # Exécuter les tests E2E en mode surveillance
```

## Storybook

Storybook est configuré pour développer et tester les composants UI de manière isolée :

```bash
npm run storybook           # Démarrer Storybook sur le port 6006
npm run build-storybook     # Construire Storybook statique
```

## Qualité du Code

### Linting

```bash
npm run lint                # Linter tous les packages
```

### Formatage

```bash
npm run format              # Formater tout le code
npm run format:check        # Vérifier le formatage
```

## Documentation API

L'API tRPC fournit des endpoints typés. Routes principales :

### Mise en Cache des Données avec tRPC + React Query

Cette application utilise **tRPC avec React Query** pour la mise en cache automatique des requêtes et les mises à jour optimistes. Tous les appels API via tRPC sont automatiquement mis en cache, réduisant les requêtes réseau redondantes et améliorant les performances.

#### Configuration du Cache

Les paramètres de cache par défaut (configurés dans [packages/client/src/lib/trpc.tsx](packages/client/src/lib/trpc.tsx)) :

- **Stale Time** : 5 minutes — Les données sont considérées fraîches pendant 5 minutes après la récupération
- **Garbage Collection Time** : 10 minutes — Les données inutilisées sont supprimées du cache après 10 minutes
- **Retry** : 3 tentatives — Les requêtes échouées sont retentées jusqu'à 3 fois avant d'afficher une erreur
- **Refetch on Window Focus** : Activé — Les données sont récupérées en arrière-plan lorsque vous revenez sur l'onglet

#### Exemple de Comportement du Cache

```tsx
// Premier rendu : Récupère depuis l'API (affiche l'état de chargement)
const { data, isLoading } = trpc.case.list.useQuery();

// Navigation et retour dans les 5 minutes :
// - Retourne les données en cache instantanément (pas d'état de chargement)
// - Affiche les données en <100ms

// Après 5 minutes :
// - Retourne les données en cache instantanément (données périmées)
// - Récupère en arrière-plan pour obtenir des données fraîches
```

#### Utilisation des DevTools React Query

En mode développement, les DevTools React Query apparaissent dans le coin inférieur droit :

1. Cliquez sur l'icône des devtools pour ouvrir
2. Consultez toutes les requêtes en cache et leur statut
3. Inspectez les données de requête, le statut de récupération et les timings du cache
4. Invalidez ou récupérez manuellement des requêtes pour les tests

**Remarque** : Les DevTools n'apparaissent qu'en mode développement (`npm run dev`), pas dans les builds de production.

#### Invalidation du Cache

Lorsque vous mutez des données (créer, mettre à jour, supprimer), le cache se met à jour automatiquement :

```tsx
const utils = trpc.useUtils();

// Après la création d'un dossier, invalider la requête de liste
const createCase = trpc.case.create.useMutation({
  onSuccess: () => {
    // Ceci récupère à nouveau la liste des dossiers
    utils.case.list.invalidate();
  },
});
```

#### Bénéfices de Performance

- **Navigation instantanée** : Les données en cache apparaissent en <100ms lors de la navigation vers une page
- **Charge serveur réduite** : Les requêtes dans le délai de péremption (5 min) n'atteignent pas le serveur
- **Mises à jour en arrière-plan** : Les données périmées sont mises à jour de façon transparente sans états de chargement
- **Déduplication automatique** : Plusieurs composants utilisant la même requête partagent une seule requête réseau

---

### Récupération de Données avec tRPC + React Query

Tous les exemples ci-dessous utilisent le client tRPC configuré avec React Query pour la mise en cache automatique et la gestion d'état.

#### Exemple de Requête Basique

```tsx
import { trpc } from '../lib/trpc';

function CaseList() {
  const { data, isLoading, error } = trpc.case.list.useQuery();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <ul>
      {data.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
```

#### Requête avec Paramètres

```tsx
function CaseListByStatus({ status }: { status: string }) {
  const { data } = trpc.case.list.useQuery(
    { status },
    {
      // Options personnalisées pour cette requête
      staleTime: 1000 * 60, // Fraîche pendant 1 minute
      enabled: !!status, // Exécuter uniquement si le statut est fourni
    }
  );

  return <div>{/* ... */}</div>;
}
```

#### Exemple de Mutation avec Invalidation du Cache

```tsx
function CreateCaseForm() {
  const utils = trpc.useUtils();

  const createCase = trpc.case.create.useMutation({
    onSuccess: () => {
      // Récupérer à nouveau la liste des dossiers pour afficher le nouveau dossier
      utils.case.list.invalidate();
    },
    onError: (error) => {
      alert(`Échec de la création du dossier : ${error.message}`);
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
      {/* champs du formulaire */}
      <button type="submit" disabled={createCase.isLoading}>
        {createCase.isLoading ? 'Création...' : 'Créer un dossier'}
      </button>
    </form>
  );
}
```

#### Mises à Jour Optimistes

```tsx
function UpdateCaseStatus({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();

  const updateStatus = trpc.case.update.useMutation({
    onMutate: async (newData) => {
      // Annuler les récupérations en cours
      await utils.case.getById.cancel({ id: caseId });

      // Capturer la valeur précédente
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Mettre à jour optimistiquement vers la nouvelle valeur
      utils.case.getById.setData({ id: caseId }, (old) =>
        old ? { ...old, status: newData.status } : old
      );

      return { previousCase };
    },
    onError: (err, newData, context) => {
      // Annuler en cas d'erreur
      utils.case.getById.setData({ id: caseId }, context?.previousCase);
    },
    onSettled: () => {
      // Toujours récupérer après erreur ou succès
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  return (
    <button onClick={() => updateStatus.mutate({ id: caseId, status: 'CLOSED' })}>
      Fermer le dossier
    </button>
  );
}
```

#### Modèles de Test

Lors du test de composants utilisant des requêtes tRPC, utilisez les utilitaires de test de `src/test/utils.ts` :

```tsx
import { renderWithTrpc } from '../test/utils';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

test('affiche les dossiers depuis l\'API', async () => {
  // Simuler la réponse de l'API
  server.use(
    http.post('http://localhost:3000/trpc/case.list', () => {
      return HttpResponse.json({
        result: {
          data: [{ id: '1', title: 'Dossier Test', description: 'Test', status: 'OPEN' }],
        },
      });
    })
  );

  // Rendre le composant avec le fournisseur tRPC
  const { getByText } = renderWithTrpc(<CaseList />);

  // Attendre que les données se chargent
  await waitFor(() => {
    expect(getByText('Dossier Test')).toBeInTheDocument();
  });
});
```

Pour plus d'exemples, voir :

- [Modèles de Requête](specs/001-trpc-react-query/contracts/query-example.tsx)
- [Modèles de Mutation](specs/001-trpc-react-query/contracts/mutation-example.tsx)
- [Modèles de Test](specs/001-trpc-react-query/contracts/test-example.test.tsx)
- [Guide de Démarrage Rapide](specs/001-trpc-react-query/quickstart.md)

### Santé

- `health.query()` - Vérifier la santé de l'API

### Utilisateurs

- `user.list.query()` - Obtenir tous les utilisateurs
- `user.getById.query({ id })` - Obtenir un utilisateur par ID

### Dossiers

- `case.list.query({ status?, assignedTo? })` - Obtenir les dossiers avec filtres
- `case.getById.query({ id })` - Obtenir un dossier par ID
- `case.create.mutation({ title, description, createdBy, assignedTo? })` - Créer un dossier
- `case.update.mutation({ id, ...updates })` - Mettre à jour un dossier
- `case.delete.mutation({ id })` - Supprimer un dossier

## Contribution

1. Créer une branche de fonctionnalité
2. Effectuer vos modifications
3. Exécuter les tests : `npm run test`
4. Exécuter le linting : `npm run lint`
5. Formater le code : `npm run format`
6. Soumettre une pull request

## Licence

MIT

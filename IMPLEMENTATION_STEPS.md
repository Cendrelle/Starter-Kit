# Integration Frontend/Backend - Plan d'implementation

## Objectif
Connecter progressivement le frontend Next.js au backend Express/Prisma en remplacant les donnees locales (mock/localStorage) par des appels API reels.

## Prerequis
- Backend lance sur `http://localhost:3030`
- Frontend lance sur `http://localhost:3000`
- Variable d'environnement frontend:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:3030/api`
- Base de donnees migree et `JWT_SECRET` configure cote backend

## Phase 1 - Fondations API et Auth candidat
- [ ] Ajouter un client HTTP centralise (`src/lib/api.ts`)
- [ ] Ajouter la gestion du token JWT (`src/lib/auth.ts`)
- [ ] Mapper les DTO backend vers types frontend (`src/lib/mappers.ts`)
- [ ] Integrer inscription candidat (`POST /api/auth/register`)
- [ ] Integrer connexion candidat (`POST /api/auth/login`)

## Phase 2 - Flux candidat
- [ ] Integrer demande de PC (`POST /api/pc-requests`)
- [ ] Integrer lecture de ma demande (`GET /api/pc-requests/me`)
- [ ] Integrer listing des offres (`GET /api/jobs`)
- [ ] Integrer candidature a une offre (`POST /api/jobs/:id/apply`)

## Phase 3 - Flux admin
- [ ] Integrer login admin via `/api/auth/login` (role `ADMIN`)
- [ ] Integrer demandes PC admin (`GET /api/pc-requests`)
- [ ] Integrer validation demande PC (`PATCH /api/pc-requests/:id/status`)
- [ ] Integrer CRUD offres (`/api/jobs`)
- [ ] Integrer candidatures admin (`GET/PATCH /api/job-applications/admin*`)

## Phase 4 - Dons et statistiques
- [ ] Integrer dons PC (`POST /api/donations/pc`)
- [ ] Integrer cagnotte commune (`POST /api/donations/common`)
- [ ] Integrer stats dons (`GET /api/donations/stats`)

## Phase 5 - Durcissement
- [ ] Normaliser les erreurs backend (messages + codes)
- [ ] Gerer CORS proprement
- [ ] Ajouter loading/errors UI sur toutes les pages connectees
- [ ] Ajouter tests API et smoke tests frontend

## Demarrage effectif
Cette session lance la **Phase 1** et une partie de la **Phase 2**:
- Auth candidat (register/login)
- Demande PC (create)
- Jobs (list/apply)

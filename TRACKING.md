# Tracking integration frontend/backend

## 2026-02-26

### Etape 1 - Base integration
- [x] Ajout plan d'implementation: `IMPLEMENTATION_STEPS.md`
- [x] Ajout client API frontend (`src/lib/api.ts`)
- [x] Ajout gestion JWT frontend (`src/lib/auth.ts`)
- [x] Ajout mappers backend/frontend (`src/lib/mappers.ts`)
- [x] Integration auth candidat (register/login)
- [x] Integration demande PC (create)
- [x] Integration jobs (liste + candidature)
- [x] Backend: activation CORS
- [x] Backend: fix `req.user.userId` pour PC requests

### Etape 2 - Backend-first complet (en cours)
- [x] Creation fichier de suivi `TRACKING.md`
- [x] Backend: endpoint candidat pour ses candidatures
- [x] Backend: verrou admin sur endpoints admin candidatures
- [x] Backend: endpoint `PATCH /jobs/:id/status` pour activer/desactiver les offres
- [x] Backend: endpoint `GET /auth/me`
- [x] Frontend: login admin via API (pas de cred hardcode)
- [x] Frontend: dashboard admin connecte API (PC, jobs, candidatures)
- [x] Frontend: donation connectee API
- [x] Frontend: cagnotte connectee stats API
- [x] Frontend: profil candidat charge ses donnees depuis backend
- [x] Frontend: suppression fallback local sur pages connectees (jobs/admin/profil)
- [x] Validation lint frontend OK
- [x] Correctif donation: si "don anonyme" est coche, les champs nom/email/telephone ne sont plus demandes
- [x] Correctif demande PC: `futureProject` renforce + validation min 20 caracteres cote frontend + fix accessibilite (`id/name/label`) des textareas
- [x] Correctif backend PC `/pc-requests/me`: usage de `req.user.userId` (au lieu de `req.user.id`) pour eliminer le 500
- [x] Correctif sessions candidate/admin: tokens separes + scope auto selon route (`/candidate` vs `/admin`) pour eviter les donnees profil vides
- [x] Correctif candidatures: normalisation email en minuscules (frontend + backend auth + backend apply/me)
- [x] Correctif dashboard/token: interceptor API selectionne explicitement le token selon `window.location.pathname` pour eviter `No token provided` sur admin/candidate
- [x] Ajout backend stats globales: `GET /api/stats/overview` (dons FCFA, users, jobs, candidatures, demandes PC, inventaire, impact)
- [x] Dashboard admin branche aux stats backend (cartes enrichies: dons recu, inventaire total/en stock/livres, etc.)
- [x] Page d'accueil branchee aux stats backend (kpis remplaces: dons FCFA, candidats, jobs, progression et inventaire)
- [x] UI demandes PC (admin): textes longs "projet futur/justification" affiches dans des encadres compacts avec hauteur limitee + scroll interne
- [x] Navigation detail demande PC: clic sur une demande ouvre `/admin/pc-requests/[id]` avec affichage complet + actions
- [x] Backend ajoute: `GET /api/pc-requests/:id` (admin) pour alimenter la page detail
- [x] Home: bouton "Voir tous les donateurs" active (redirige vers `/cagnotte-commune`)
- [x] Dashboard mobile: cartes statistiques compactes en grille 2 colonnes
- [x] Demandes PC mobile: bouton `Voir` ajoute sur chaque carte

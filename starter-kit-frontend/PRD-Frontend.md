# PRD Frontend - StarterKit (Version consolidee)

## 1. Vision
StarterKit est une plateforme web qui reduit deux freins majeurs a l insertion:
- acces a un ordinateur
- acces a des offres de stage

Le frontend doit inspirer confiance aux donateurs, faciliter les candidatures et offrir une administration complete.

## 2. Personae
- Candidat: demande un PC, suit son statut, postule aux stages.
- Donateur: contribue sans inscription obligatoire.
- Recruteur: consulte et publie des offres (phase suivante).
- Administrateur: valide demandes PC, gere offres, candidatures, carrousel.

## 3. Parcours principaux
### 3.1 Donateur
- Arrive sur la landing.
- Choisit donation libre, categorie PC ou prise en charge complete.
- Peut donner en anonyme.
- Finalise via tunnel de don.

### 3.2 Candidat
- Inscription / connexion.
- Soumission demande PC en plusieurs etapes.
- Consultation profil: demandes PC + candidatures.

### 3.3 Candidature stage sans login
- Consultation du job board.
- Postulation rapide via formulaire.
- Candidature visible dans dashboard admin.

### 3.4 Admin
- Connexion obligatoire avant acces au dashboard.
- Ligne 1 dashboard: demandes PC + actions accepter/refuser.
- Ligne 2 dashboard: offres de stage + candidatures.
- Gestion carrousel: ajout/activation/suppression et rendu homepage.

## 4. Modules frontend
### 4.1 Public
- Home avec carrousel hero, sections impact, categories PC, partenaires.
- Page donation avec:
  - categories Basic/Standard/Premium
  - quote-part etudiant 40%
  - option prise en charge 100% par donateur
- Page stages avec filtres et formulaire candidature rapide.

### 4.2 Candidat
- Login/Register.
- Profil candidat.
- Demande PC multi-etapes.

### 4.3 Admin
- Login admin.
- Dashboard operationnel compact.
- Gestion demandes PC, offres, candidatures, carrousel.

## 5. Regles metier frontend
- Admin:
  - acces interdit sans session admin.
  - une demande PC acceptee/refusee est grisee et verrouillee.
- Don:
  - 60% par defaut cote donateur (40% etudiant), ou 100% si choisi.
- Stage:
  - candidature sans compte possible.

## 6. Etat et persistence
- Store frontend localStorage partage:
  - session admin
  - session candidat
  - demandes PC
  - offres
  - candidatures
  - images carrousel
  - langue FR/EN (FR par defaut)

## 7. I18n
- Langue par defaut: francais.
- Toggle FR/EN en header.
- Extensible via dictionnaire central.

## 8. Roadmap frontend
### Phase actuelle (frontend only)
- UX complete et interactive avec donnees persistantes localement.

### Phase suivante (backend integration)
- API NestJS + PostgreSQL/Prisma.
- Auth Firebase/JWT reelle.
- Paiements Stripe/PayPal/Mobile Money.
- Upload Cloudinary.
- Notifications email automatiques.

# Marketplace tracking

## 2026-03-12

- [x] Schema Prisma: ajout MarketplaceItem + MarketplaceOrder + enums (categories + statut)
- [x] Migration SQL: tables marketplace + indexes + foreign keys
- [x] Backend: routes `/api/marketplace/*` + controller (listing, detail, creation, status, achat)
- [x] Frontend: page `/marketplace` (listing, filtres, CTA)
- [x] Frontend: mapping DTO marketplace + types
- [x] Navigation: lien Marketplace dans le header
- [x] Frontend: formulaire publication + branchement achat (`/api/marketplace/items/:id/purchase`)

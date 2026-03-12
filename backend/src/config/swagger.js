const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3030";

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "StarterKit API",
    version: "1.0.0",
    description: "Documentation interactive de l'API StarterKit.",
  },
  servers: [
    {
      url: `${apiBaseUrl}/api`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Inscription candidat",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Token JWT" },
          400: { description: "Email already used" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Connexion",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Token JWT" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Infos utilisateur connecté",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/jobs": {
      get: {
        summary: "Lister les offres",
        responses: { 200: { description: "Jobs list" } },
      },
      post: {
        summary: "Créer une offre (ADMIN)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Job created" } },
      },
    },
    "/jobs/{id}": {
      get: {
        summary: "Détail d'une offre",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Job detail" }, 404: { description: "Not found" } },
      },
      put: {
        summary: "Mettre à jour une offre (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Job updated" } },
      },
      delete: {
        summary: "Supprimer une offre (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Job deleted" } },
      },
    },
    "/jobs/{id}/status": {
      patch: {
        summary: "Activer / désactiver une offre (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Job updated" } },
      },
    },
    "/jobs/{id}/apply": {
      post: {
        summary: "Postuler à une offre",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 201: { description: "Application created" } },
      },
    },
    "/profile": {
      get: {
        summary: "Récupérer le profil",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Profile" } },
      },
      post: {
        summary: "Créer / mettre à jour le profil",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Profile updated" } },
      },
    },
    "/pc-requests": {
      get: {
        summary: "Lister les demandes PC (ADMIN)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "PC requests" } },
      },
      post: {
        summary: "Créer une demande PC",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "PC request created" } },
      },
    },
    "/pc-requests/me": {
      get: {
        summary: "Voir ma demande PC",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "My request" } },
      },
    },
    "/pc-requests/{id}": {
      get: {
        summary: "Détail d'une demande PC (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "PC request detail" } },
      },
    },
    "/pc-requests/{id}/status": {
      patch: {
        summary: "Changer le statut d'une demande PC (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "PC request updated" } },
      },
    },
    "/job-applications/admin": {
      get: {
        summary: "Lister les candidatures (ADMIN)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Applications" } },
      },
    },
    "/job-applications/{id}/status": {
      patch: {
        summary: "Changer le statut d'une candidature (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Application updated" } },
      },
    },
    "/donations/pc": {
      post: {
        summary: "Don PC",
        responses: { 201: { description: "Donation created" } },
      },
    },
    "/donations/common": {
      post: {
        summary: "Don cagnotte commune",
        responses: { 201: { description: "Donation created" } },
      },
    },
    "/donations/stats": {
      get: {
        summary: "Statistiques dons",
        responses: { 200: { description: "Donation stats" } },
      },
    },
    "/stats/overview": {
      get: {
        summary: "Statistiques globales",
        responses: { 200: { description: "Overview stats" } },
      },
    },
    "/marketplace/items": {
      get: {
        summary: "Lister les ressources marketplace",
        responses: { 200: { description: "Items list" } },
      },
      post: {
        summary: "Publier une ressource",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "Item created" } },
      },
    },
    "/marketplace/items/{id}": {
      get: {
        summary: "Détail ressource marketplace",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Item detail" } },
      },
    },
    "/marketplace/items/{id}/status": {
      patch: {
        summary: "Activer / désactiver une ressource (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Item updated" } },
      },
    },
    "/marketplace/items/{id}/purchase": {
      post: {
        summary: "Achat ressource marketplace",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 201: { description: "Order created" } },
      },
    },
  },
};

export default swaggerSpec;

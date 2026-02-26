import { CandidateSession } from "@/utils/frontendStore";

type AuthScope = "candidate" | "admin";

const CANDIDATE_AUTH_TOKEN_KEY = "starterkit_auth_token_candidate_v1";
const ADMIN_AUTH_TOKEN_KEY = "starterkit_auth_token_admin_v1";
const AUTH_SCOPE_KEY = "starterkit_auth_scope_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function getTokenKey(scope: AuthScope) {
  return scope === "admin" ? ADMIN_AUTH_TOKEN_KEY : CANDIDATE_AUTH_TOKEN_KEY;
}

function getAuthScope(): AuthScope {
  if (!isBrowser()) return "candidate";
  const scope = window.localStorage.getItem(AUTH_SCOPE_KEY);
  return scope === "admin" ? "admin" : "candidate";
}

export function setAuthScope(scope: AuthScope) {
  if (!isBrowser()) return;
  window.localStorage.setItem(AUTH_SCOPE_KEY, scope);
}

export function getAuthToken(scope?: AuthScope) {
  if (!isBrowser()) return null;
  const resolvedScope = scope || getAuthScope();
  const scopedToken = window.localStorage.getItem(getTokenKey(resolvedScope));
  if (scopedToken) return scopedToken;

  const candidateToken = window.localStorage.getItem(CANDIDATE_AUTH_TOKEN_KEY);
  const adminToken = window.localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
  return candidateToken || adminToken;
}

export function setAuthToken(token: string, scope: AuthScope = "candidate") {
  if (!isBrowser()) return;
  window.localStorage.setItem(getTokenKey(scope), token);
  window.localStorage.setItem(AUTH_SCOPE_KEY, scope);
}

export function clearAuthToken(scope?: AuthScope) {
  if (!isBrowser()) return;
  if (scope) {
    window.localStorage.removeItem(getTokenKey(scope));
    const activeScope = getAuthScope();
    if (activeScope === scope) {
      window.localStorage.removeItem(AUTH_SCOPE_KEY);
    }
    return;
  }

  window.localStorage.removeItem(CANDIDATE_AUTH_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_SCOPE_KEY);
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function buildCandidateSession(email: string, token: string): CandidateSession {
  const payload = parseJwtPayload(token);
  const userId = typeof payload?.userId === "number" ? String(payload.userId) : `cand-${Date.now()}`;

  return {
    id: userId,
    fullName: email.split("@")[0] || "Candidate",
    email,
    phone: "",
    role: "candidate",
  };
}

export function getRoleFromToken(token: string): string | null {
  const payload = parseJwtPayload(token);
  return typeof payload?.role === "string" ? payload.role : null;
}

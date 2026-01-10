import { Session, User } from "@/types";

const SESSION_KEY = "partner_onboarding_session";

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as Session;
    return session;
  } catch (error) {
    console.error("Error reading session:", error);
    return null;
  }
}

export function getToken(): string | null {
  const session = getSession();
  return session?.token || null;
}

export function getUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Error clearing session:", error);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

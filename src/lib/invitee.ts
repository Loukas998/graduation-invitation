import { useEffect, useState } from "react";

export interface Invitee {
  name: string;
  nameAr: string;
}

interface InviteeState {
  loading: boolean;
  invitee: Invitee | null;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Resolved results, so switching language doesn't re-flash the skeleton. */
const cache = new Map<string, Invitee | null>();

function currentToken(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("t");
}

/**
 * Mock of `GET /api/invitee?token=xxx`.
 * Vite has no server route, so this simulates the backend on the client.
 * To go live, replace the body with:
 *   const res = await fetch(`/api/invitee?token=${encodeURIComponent(token)}`);
 *   return res.ok ? ((await res.json()) as Invitee) : null;
 */
async function fetchInvitee(token: string): Promise<Invitee | null> {
  await delay(900);
  const directory: Record<string, Invitee> = {
    demo: { name: "Dr. Sarah Haddad", nameAr: "د. سارة حدّاد" },
  };
  return directory[token] ?? null;
}

/** Reads `?t=` from the URL and resolves the invitee, with graceful fallback. */
export function useInvitee(): InviteeState {
  const token = currentToken();

  const [state, setState] = useState<InviteeState>(() => {
    if (!token) return { loading: false, invitee: null };
    if (cache.has(token)) return { loading: false, invitee: cache.get(token)! };
    return { loading: true, invitee: null };
  });

  useEffect(() => {
    if (!token || cache.has(token)) return;

    let active = true;
    fetchInvitee(token)
      .then((invitee) => {
        cache.set(token, invitee);
        if (active) setState({ loading: false, invitee });
      })
      .catch(() => active && setState({ loading: false, invitee: null }));

    return () => {
      active = false;
    };
  }, [token]);

  return state;
}

/**
 * API client for CampusNest AI.
 *
 * Provides streaming search via SSE and authenticated requests.
 */

import { supabase } from "../lib/supabase";
import type { Listing } from "../types";

const API_BASE = "/api";

// ---------------------------------------------------------------------------
// Authenticated fetch helper
// ---------------------------------------------------------------------------

async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers);
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  return fetch(url, { ...options, headers });
}

// ---------------------------------------------------------------------------
// Listing parsing (landlord)
// ---------------------------------------------------------------------------

export async function parseListing(
  description: string
): Promise<unknown> {
  const response = await authFetch(`${API_BASE}/listing/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    throw new Error("Listing parse failed");
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Streaming search via SSE
// ---------------------------------------------------------------------------

export type StageEventHandler = (event: {
  type: string;
  data: Record<string, unknown>;
}) => void;

export function searchAccommodationStream(
  query: string,
  onEvent: StageEventHandler,
  onError?: (error: Error) => void
): () => void {
  const url = `${API_BASE}/search/stream?query=${encodeURIComponent(query)}`;
  const abortController = new AbortController();
  let closed = false;

  (async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(url, {
        signal: abortController.signal,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done || closed) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const event = JSON.parse(trimmed.slice(6));
              onEvent(event);

              if (event.type === "search:done") {
                closed = true;
                reader.cancel().catch(() => {});
                return;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      if (!closed) {
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    }
  })();

  return () => {
    closed = true;
    abortController.abort();
  };
}

// ---------------------------------------------------------------------------
// All listings fetch
// ---------------------------------------------------------------------------

export async function getAllListings(): Promise<Listing[]> {
  try {
    const response = await authFetch(`${API_BASE}/listings`);
    if (!response.ok) return [];
    const data = (await response.json()) as { listings: Listing[] };
    return data.listings ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Single listing fetch
// ---------------------------------------------------------------------------

export async function getListingById(id: string): Promise<{
  listing: Record<string, unknown>;
  reviews: Record<string, unknown>[];
  verification: Record<string, unknown> | null;
} | null> {
  try {
    const response = await authFetch(`${API_BASE}/listing/${id}`);
    if (!response.ok) return null;
    const data = (await response.json()) as {
      listing: Record<string, unknown>;
      reviews: Record<string, unknown>[];
      verification: Record<string, unknown> | null;
    };
    return data;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Create listing (landlord)
// ---------------------------------------------------------------------------

export async function createListing(listing: {
  title: string;
  description: string;
  university: string;
  location: string;
  area: string;
  price: number;
  distance: number;
  wifi: boolean;
  bathrooms: number;
  kitchen: boolean;
  gender: string;
  noiseLevel: string;
  category: string;
  amenities: string[];
}): Promise<{ success: boolean; listingId?: string; error?: string }> {
  const response = await authFetch(`${API_BASE}/listing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listing),
  });

  const data = (await response.json()) as {
    success: boolean;
    listingId?: string;
    error?: string;
  };
  return data;
}

// ---------------------------------------------------------------------------
// Search history
// ---------------------------------------------------------------------------

export async function saveSearchHistory(
  searchQuery: string,
  structuredSearch: unknown,
  recommendations: unknown
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("search_history").insert({
    user_id: user.id,
    search_query: searchQuery,
    structured_search: structuredSearch,
    recommendations: recommendations,
  });
}

/**
 * API client for CampusNest AI.
 *
 * Provides streaming search via SSE.
 */

const API_BASE = "/api";

// ---------------------------------------------------------------------------
// Streaming search via SSE
// ---------------------------------------------------------------------------

export type StageEventHandler = (event: {
  type: string;
  data: Record<string, unknown>;
}) => void;

// ---------------------------------------------------------------------------
// Listing parsing (landlord)
// ---------------------------------------------------------------------------

export async function parseListing(
  description: string
): Promise<unknown> {
  const response = await fetch(`${API_BASE}/listing/parse`, {
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
      const response = await fetch(url, { signal: abortController.signal });

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

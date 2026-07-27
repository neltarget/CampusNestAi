/**
 * Search Routes
 *
 * Simplified API endpoints using the AI Orchestrator.
 * The frontend makes one search request and receives a complete response.
 */

import { Router } from "express";
import {
  executeSearch,
  type OrchestratorStage,
} from "../services/ai-orchestrator/index.js";
import { loadPrompt } from "../prompts/prompt-loader.js";
import getOpenAI from "../services/openai.js";
import getClient from "../services/supabase.js";
import {
  authMiddleware,
  type AuthenticatedRequest,
} from "../middleware/auth.js";

export const searchRouter = Router();

// Apply auth middleware to all search routes (attaches user if token present)
searchRouter.use(authMiddleware);

/**
 * POST /api/search
 * Returns full search results (non-streaming).
 */
searchRouter.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    if (query.length > 500) {
      res.status(400).json({ error: "Query too long (max 500 characters)" });
      return;
    }

    const result = await executeSearch(query);

    // Save search history for authenticated users
    const authReq = req as AuthenticatedRequest;
    if (authReq.user) {
      try {
        const supabase = getClient();
        await supabase.from("search_history").insert({
          user_id: authReq.user.id,
          search_query: query,
          structured_search: result.intent,
          recommendations: result.listings,
        });
      } catch {
        // Non-critical — don't fail the search if history save fails
      }
    }

    res.json(result);
  } catch (_error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/search/stream?query=...
 * Streams stage events via SSE.
 *
 * Event types:
 *   stage:started   — a stage begins executing
 *   stage:completed — a stage finished successfully
 *   stage:failed    — a stage failed
 *   search:done     — search finished (includes full result)
 */
searchRouter.get("/search/stream", async (req, res) => {
  const query = req.query.query as string;

  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }

  if (query.length > 500) {
    res.status(400).json({ error: "Query too long (max 500 characters)" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const sendEvent = (event: { type: string; data: Record<string, unknown> }): void => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  try {
    const result = await executeSearch(query, (stages: OrchestratorStage[]) => {
      // Send events for each stage update
      for (const stage of stages) {
        if (stage.status === "running") {
          sendEvent({
            type: "stage:started",
            data: { stage: stage.name, timestamp: new Date().toISOString() },
          });
        } else if (stage.status === "completed") {
          sendEvent({
            type: "stage:completed",
            data: {
              stage: stage.name,
              duration: stage.duration,
              timestamp: new Date().toISOString(),
            },
          });
        } else if (stage.status === "failed") {
          sendEvent({
            type: "stage:failed",
            data: {
              stage: stage.name,
              error: stage.error,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    });

    sendEvent({
      type: "search:done",
      data: result as unknown as Record<string, unknown>,
    });

    // Save search history for authenticated users
    const authReq = req as AuthenticatedRequest;
    if (authReq.user) {
      try {
        const supabase = getClient();
        await supabase.from("search_history").insert({
          user_id: authReq.user.id,
          search_query: query,
          structured_search: result.intent,
          recommendations: result.listings,
        });
      } catch {
        // Non-critical
      }
    }
  } catch (error) {
    sendEvent({
      type: "search:done",
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  } finally {
    res.end();
  }
});

/**
 * POST /api/listing/parse
 * Converts natural language description into a structured listing.
 */
searchRouter.post("/listing/parse", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== "string") {
      res.status(400).json({ error: "description is required" });
      return;
    }

    const prompt = loadPrompt("listing", { description });

    const completion = await getOpenAI().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      res.status(500).json({ error: "No response from AI" });
      return;
    }

    const parsed = JSON.parse(content) as Record<string, unknown>;

    const listing = {
      title: parsed.title ?? "Untitled Listing",
      description: parsed.description ?? description,
      university: parsed.university ?? "",
      location: parsed.location ?? "",
      price: typeof parsed.price === "number" ? parsed.price : 0,
      distance: typeof parsed.distance === "number" ? parsed.distance : 0,
      wifi: typeof parsed.wifi === "boolean" ? parsed.wifi : false,
      bathrooms: typeof parsed.bathrooms === "number" ? parsed.bathrooms : 1,
      kitchen: typeof parsed.kitchen === "boolean" ? parsed.kitchen : false,
      gender: validateGender(parsed.gender),
      noiseLevel: validateNoiseLevel(parsed.noiseLevel),
    };

    res.json({ success: true, output: listing });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

function validateGender(value: unknown): string {
  if (typeof value === "string" && ["male", "female", "mixed"].includes(value)) {
    return value;
  }
  return "mixed";
}

function validateNoiseLevel(value: unknown): string {
  if (typeof value === "string" && ["quiet", "moderate", "loud"].includes(value)) {
    return value;
  }
  return "moderate";
}

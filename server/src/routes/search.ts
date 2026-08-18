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
import getClient, { getClientWithToken } from "../services/supabase.js";
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
        const token = authReq.headers.authorization?.slice(7);
        const supabase = token ? getClientWithToken(token) : getClient();
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
        const token = authReq.headers.authorization?.slice(7);
        const supabase = token ? getClientWithToken(token) : getClient();
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
      model: "llama-3.1-70b-versatile",
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

// ---------------------------------------------------------------------------
// Listing endpoints
// ---------------------------------------------------------------------------

/**
 * GET /api/listings
 * Fetch all listings from Supabase.
 */
searchRouter.get("/listings", async (_req, res) => {
  try {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`
        id,
        title,
        description,
        university,
        location,
        price,
        distance,
        wifi,
        bathrooms,
        kitchen,
        gender,
        noise_level,
        created_at,
        images(url),
        reviews(id, rating),
        verification_records(confidence)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: "Failed to fetch listings" });
      return;
    }

    const listings = (data ?? []).map((row: Record<string, unknown>) => {
      const images = row.images
        ? (Array.isArray(row.images) ? row.images : [row.images])
            .map((img: Record<string, unknown>) => img?.url)
            .filter(Boolean)
        : [];

      const reviews = row.reviews
        ? (Array.isArray(row.reviews) ? row.reviews : [row.reviews])
        : [];

      const verificationRecords = row.verification_records
        ? (Array.isArray(row.verification_records)
            ? row.verification_records
            : [row.verification_records])
        : [];

      const avgRating =
        reviews.length > 0
          ? reviews.reduce(
              (sum: number, r: Record<string, unknown>) => sum + Number(r.rating ?? 0),
              0
            ) / reviews.length
          : null;

      const avgConfidence =
        verificationRecords.length > 0
          ? verificationRecords.reduce(
              (sum: number, v: Record<string, unknown>) =>
                sum + Number(v.confidence ?? 0),
              0
            ) / verificationRecords.length
          : null;

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        university: row.university,
        location: row.location,
        price: Number(row.price),
        distance: Number(row.distance),
        wifi: row.wifi,
        bathrooms: row.bathrooms,
        kitchen: row.kitchen,
        gender: row.gender,
        noiseLevel: row.noise_level,
        images,
        reviewScore: avgRating,
        verificationScore: avgConfidence,
        createdAt: row.created_at,
      };
    });

    res.json({ listings });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/listing/:id
 * Fetch a single listing by ID from Supabase.
 */
searchRouter.get("/listing/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`
        id,
        title,
        description,
        university,
        location,
        price,
        distance,
        wifi,
        bathrooms,
        kitchen,
        gender,
        noise_level,
        created_at,
        images(url),
        reviews(id, rating, comment),
        verification_records(verification_date, confidence, notes)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    // Map to frontend shape
    const images = data.images
      ? (Array.isArray(data.images) ? data.images : [data.images]).map((img: Record<string, unknown>) => img?.url).filter(Boolean)
      : [];

    const reviews = data.reviews
      ? (Array.isArray(data.reviews) ? data.reviews : [data.reviews]).map((r: Record<string, unknown>) => ({
          id: r.id,
          listingId: id,
          rating: r.rating,
          comment: r.comment,
        }))
      : [];

    const verificationRecords = data.verification_records
      ? (Array.isArray(data.verification_records) ? data.verification_records : [data.verification_records])
      : [];

    const verification = verificationRecords.length > 0
      ? {
          id: `${id}-verif`,
          listingId: id,
          verificationDate: verificationRecords[0].verification_date,
          confidence: verificationRecords[0].confidence,
          notes: verificationRecords[0].notes,
        }
      : null;

    const avgReview =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) / reviews.length
        : null;

    const listing = {
      id: data.id,
      title: data.title,
      description: data.description,
      university: data.university,
      location: data.location,
      price: Number(data.price),
      distance: Number(data.distance),
      wifi: data.wifi,
      bathrooms: data.bathrooms,
      kitchen: data.kitchen,
      gender: data.gender,
      noiseLevel: data.noise_level,
      images,
      reviewScore: avgReview,
      verificationScore: verification?.confidence ?? null,
      createdAt: data.created_at,
    };

    res.json({ listing, reviews, verification });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/listing
 * Create a new listing (requires authentication, landlord role).
 */
searchRouter.post("/listing", async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { title, description, university, location, price, distance, wifi, bathrooms, kitchen, gender, noiseLevel } = req.body;

    if (!title || !description || !university || !location || price == null) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const supabase = getClient();

    // Insert listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        title,
        description,
        university,
        location,
        price: Number(price),
        distance: Number(distance) || 0,
        wifi: Boolean(wifi),
        bathrooms: Number(bathrooms) || 1,
        kitchen: Boolean(kitchen),
        gender: validateGender(gender),
        noise_level: validateNoiseLevel(noiseLevel),
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (listingError || !listing) {
      res.status(500).json({ error: "Failed to create listing" });
      return;
    }

    // Add a default image
    await supabase.from("images").insert({
      listing_id: listing.id,
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
    });

    res.json({ success: true, listingId: listing.id });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

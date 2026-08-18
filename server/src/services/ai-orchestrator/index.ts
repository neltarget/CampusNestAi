/**
 * AI Orchestrator Service
 *
 * Single entry point for accommodation search.
 * Makes ONE OpenAI API call for reasoning.
 * Uses deterministic helper services for database queries, ranking, and verification.
 */

import { loadPrompt } from "../../prompts/prompt-loader.js";
import getOpenAI from "../openai.js";
import { searchAccommodation } from "../accommodation-search/index.js";
import { rankListings, type RankedListing } from "../ranking/index.js";
import { verifyListings, type VerificationResult } from "../verification/index.js";
import type { SearchCriteria, Listing } from "../../types/index.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrchestratorStage {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  duration?: number;
  error?: string;
}

export interface OrchestratorResult {
  success: boolean;
  query: string;
  listings: RankedListing[];
  explanations: Explanation[];
  verifications: VerificationResult[];
  stages: OrchestratorStage[];
  duration: number;
  intent: SearchCriteria | null;
  explanation: string;
  error?: string;
}

export interface Explanation {
  listingId: string;
  summary: string;
  tradeoffs: string[];
}

interface OrchestratorResponse {
  intent: {
    university: string;
    budget: number | null;
    gender: string | null;
    preferences: string[];
    amenities: string[];
  };
  searchSummary: {
    totalFound: number;
    criteriaApplied: string[];
  };
  rankingSummary: {
    topFactors: string[];
    tradeoffsConsidered: string[];
  };
  verificationSummary: {
    overallConfidence: number;
    concerns: string[];
  };
  recommendations: Array<{
    listingId: string;
    rank: number;
    score: number;
    reason: string;
    explanation: string;
    tradeoffs: string[];
  }>;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Stage Names
// ---------------------------------------------------------------------------

export const STAGE_NAMES = [
  "intent",
  "search",
  "ranking",
  "verification",
  "ai_reasoning",
  "recommendation",
] as const;

// ---------------------------------------------------------------------------
// Main Orchestrator
// ---------------------------------------------------------------------------

/**
 * Execute a complete accommodation search.
 * This is the single public method that coordinates everything.
 */
export async function executeSearch(
  query: string,
  onStageUpdate?: (stages: OrchestratorStage[]) => void
): Promise<OrchestratorResult> {
  const startTime = Date.now();

  const stages: OrchestratorStage[] = STAGE_NAMES.map((name) => ({
    name,
    status: "pending" as const,
  }));

  const updateStage = (
    name: string,
    status: OrchestratorStage["status"],
    duration?: number,
    error?: string
  ): void => {
    const stage = stages.find((s) => s.name === name);
    if (stage) {
      stage.status = status;
      stage.duration = duration;
      stage.error = error;
    }
    onStageUpdate?.(stages);
  };

  try {
    // Stage 1: Intent Analysis (deterministic keyword extraction)
    updateStage("intent", "running");
    const intentStart = Date.now();
    const intent = extractIntent(query);
    updateStage("intent", "completed", Date.now() - intentStart);

    // Stage 2: Database Search (Supabase)
    updateStage("search", "running");
    const searchStart = Date.now();
    let listings: Listing[];
    try {
      listings = await searchAccommodation(intent);
    } catch (_error) {
      // Fallback: try broader search
      const { getAllListings } = await import("../accommodation-search/index.js");
      listings = await getAllListings();
    }
    updateStage("search", "completed", Date.now() - searchStart);

    if (listings.length === 0) {
      return {
        success: true,
        query,
        listings: [],
        explanations: [],
        verifications: [],
        stages,
        duration: Date.now() - startTime,
        intent,
        explanation: "No accommodation found matching your criteria.",
      };
    }

    // Stage 3: Ranking (deterministic scoring)
    updateStage("ranking", "running");
    const rankingStart = Date.now();
    const ranked = rankListings(listings, intent);
    updateStage("ranking", "completed", Date.now() - rankingStart);

    // Stage 4: Verification (deterministic checks)
    updateStage("verification", "running");
    const verificationStart = Date.now();
    const verifications = await verifyListings(listings);
    updateStage("verification", "completed", Date.now() - verificationStart);

    // Stage 5: AI Reasoning (ONE OpenAI call)
    updateStage("ai_reasoning", "running");
    const aiStart = Date.now();
    const aiResult = await performAIReasoning(query, ranked, intent);
    updateStage("ai_reasoning", "completed", Date.now() - aiStart);

    // Stage 6: Build Recommendations
    updateStage("recommendation", "running");
    const recStart = Date.now();
    const { listings: finalListings, explanations } = buildRecommendations(
      ranked,
      aiResult
    );
    updateStage("recommendation", "completed", Date.now() - recStart);

    return {
      success: true,
      query,
      listings: finalListings,
      explanations,
      verifications,
      stages,
      duration: Date.now() - startTime,
      intent,
      explanation: aiResult.explanation,
    };
  } catch (error) {
    // Mark current stage as failed
    const runningStage = stages.find((s) => s.status === "running");
    if (runningStage) {
      updateStage(
        runningStage.name,
        "failed",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
    }

    return {
      success: false,
      query,
      listings: [],
      explanations: [],
      verifications: [],
      stages,
      duration: Date.now() - startTime,
      intent: null,
      explanation: "Search failed due to an error.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Extract search intent from natural language query.
 * Uses deterministic keyword matching (not AI).
 */
function extractIntent(query: string): SearchCriteria {
  const lower = query.toLowerCase();

  const university =
    lower.includes("knust")
      ? "KNUST"
      : lower.includes("ug") || lower.includes("legon")
        ? "University of Ghana"
        : lower.includes("ucc")
          ? "UCC"
          : lower.includes("uew")
            ? "UEW"
            : "";

  const budgetMatch = lower.match(
    /(?:under|below|within|up to|less than)\s*(?:ghs\s*)?(\d[\d,]*)/
  );
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, "")) : null;

  const gender =
    lower.includes("female")
      ? "female"
      : lower.includes("male") && !lower.includes("female")
        ? "male"
        : null;

  const preferences: string[] = [];
  if (lower.includes("quiet")) preferences.push("quiet");
  if (lower.includes("near") || lower.includes("close"))
    preferences.push("near_campus");

  const amenities: string[] = [];
  if (lower.includes("wifi") || lower.includes("internet"))
    amenities.push("wifi");
  if (lower.includes("kitchen")) amenities.push("kitchen");

  return {
    university,
    budget,
    gender,
    roomType: null,
    preferences,
    amenities,
    distance: null,
  };
}

/**
 * Perform AI reasoning using OpenAI.
 * This is the SINGLE LLM call in the entire pipeline.
 */
async function performAIReasoning(
  query: string,
  ranked: RankedListing[],
  intent: SearchCriteria
): Promise<OrchestratorResponse> {
  const listingsForPrompt = ranked.slice(0, 10).map((r) => ({
    id: r.listing.id,
    title: r.listing.title,
    location: r.listing.location,
    price: r.listing.price,
    distance: r.listing.distance,
    wifi: r.listing.wifi,
    kitchen: r.listing.kitchen,
    gender: r.listing.gender,
    noiseLevel: r.listing.noiseLevel,
    reviewScore: r.listing.reviewScore,
    score: r.score,
    reason: r.reason,
  }));

  const prompt = loadPrompt("orchestrator", {
    query,
    listings: JSON.stringify(listingsForPrompt, null, 2),
  });

  const completion = await getOpenAI().chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI service");
  }

  const parsed = JSON.parse(content) as OrchestratorResponse;

  return {
    intent: parsed.intent ?? intent,
    searchSummary: parsed.searchSummary ?? { totalFound: ranked.length, criteriaApplied: [] },
    rankingSummary: parsed.rankingSummary ?? { topFactors: [], tradeoffsConsidered: [] },
    verificationSummary: parsed.verificationSummary ?? { overallConfidence: 0.5, concerns: [] },
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    explanation: parsed.explanation ?? "AI reasoning completed.",
  };
}

/**
 * Build final recommendations from AI response.
 */
function buildRecommendations(
  ranked: RankedListing[],
  aiResult: OrchestratorResponse
): { listings: RankedListing[]; explanations: Explanation[] } {
  const explanations: Explanation[] = [];
  const listingsMap = new Map(ranked.map((r) => [r.listing.id, r]));

  // Use AI recommendations if available, otherwise use ranked list
  const recommendations = aiResult.recommendations.length > 0
    ? aiResult.recommendations
    : ranked.slice(0, 5).map((r, i) => ({
        listingId: r.listing.id,
        rank: i + 1,
        score: r.score,
        reason: r.reason,
        explanation: `Recommended based on your criteria.`,
        tradeoffs: [],
      }));

  const finalListings: RankedListing[] = [];

  for (const rec of recommendations) {
    const rankedEntry = listingsMap.get(rec.listingId);
    if (rankedEntry) {
      finalListings.push({
        ...rankedEntry,
        score: rec.score ?? rankedEntry.score,
        reason: rec.reason ?? rankedEntry.reason,
      });

      explanations.push({
        listingId: rec.listingId,
        summary: rec.explanation ?? `Recommended: ${rankedEntry.listing.title}`,
        tradeoffs: rec.tradeoffs ?? [],
      });
    }
  }

  // If no recommendations matched, fallback to top ranked
  if (finalListings.length === 0) {
    for (const r of ranked.slice(0, 5)) {
      finalListings.push(r);
      explanations.push({
        listingId: r.listing.id,
        summary: `Recommended: ${r.listing.title} in ${r.listing.location}`,
        tradeoffs: [],
      });
    }
  }

  return { listings: finalListings, explanations };
}

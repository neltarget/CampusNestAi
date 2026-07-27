/**
 * Ranking Service
 *
 * Deterministic scoring and ranking of accommodation listings.
 * This service does NOT call OpenAI — it uses rule-based scoring.
 */

import type { SearchCriteria, Listing } from "../../types/index.js";

export interface RankedListing {
  listing: Listing;
  score: number;
  reason: string;
}

/**
 * Rank listings based on search criteria.
 * Returns sorted list with scores and reasons.
 */
export function rankListings(
  listings: Listing[],
  criteria: SearchCriteria
): RankedListing[] {
  return listings
    .map((listing) => {
      const { score, reason } = scoreListing(listing, criteria);
      return { listing, score, reason };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Score a single listing against search criteria.
 */
function scoreListing(
  listing: Listing,
  criteria: SearchCriteria
): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Budget match
  if (criteria.budget && listing.price <= criteria.budget) {
    score += 30;
    reasons.push("Within budget");
  } else if (criteria.budget) {
    const overBy = listing.price - criteria.budget;
    const penalty = Math.min(20, (overBy / criteria.budget) * 100);
    score -= penalty;
    reasons.push(`Over budget by GHS ${overBy}`);
  }

  // WiFi amenity
  if (criteria.amenities.includes("wifi") && listing.wifi) {
    score += 20;
    reasons.push("Has WiFi");
  } else if (criteria.amenities.includes("wifi") && !listing.wifi) {
    score -= 10;
    reasons.push("No WiFi");
  }

  // Quiet preference
  if (criteria.preferences.includes("quiet") && listing.noiseLevel === "quiet") {
    score += 15;
    reasons.push("Quiet environment");
  } else if (criteria.preferences.includes("quiet") && listing.noiseLevel === "loud") {
    score -= 10;
    reasons.push("May be noisy");
  }

  // Gender match
  if (criteria.gender && listing.gender === criteria.gender) {
    score += 15;
    reasons.push("Matches gender preference");
  } else if (criteria.gender && listing.gender !== "mixed") {
    score -= 5;
    reasons.push("Different gender preference");
  }

  // Kitchen amenity
  if (criteria.amenities.includes("kitchen") && listing.kitchen) {
    score += 10;
    reasons.push("Has kitchen");
  }

  // Distance
  if (listing.distance <= 2) {
    score += 10;
    reasons.push("Very close to campus");
  } else if (listing.distance <= 5) {
    score += 5;
    reasons.push("Reasonable distance");
  } else {
    score -= 5;
    reasons.push("Farther from campus");
  }

  // Review score
  if (listing.reviewScore && listing.reviewScore >= 4) {
    score += 10;
    reasons.push("Highly rated");
  }

  // Normalize score to 0-100 range
  const normalizedScore = Math.max(0, Math.min(100, score + 50));

  return {
    score: normalizedScore,
    reason: reasons.length > 0 ? reasons.join("; ") : "General match",
  };
}

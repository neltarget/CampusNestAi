/**
 * Verification Service
 *
 * Deterministic verification checks for accommodation listings.
 * This service does NOT call OpenAI — it only performs database queries
 * and rule-based checks.
 */

import getClient from "../supabase.js";
import type { Listing } from "../../types/index.js";

export interface VerificationResult {
  listingId: string;
  confidence: number;
  issues: string[];
}

interface VerificationRecord {
  listing_id: string;
  verification_date: string;
  confidence: number;
  notes: string;
}

/**
 * Verify a single listing.
 * Returns confidence score and any issues found.
 */
export async function verifyListing(
  listing: Listing
): Promise<VerificationResult> {
  const issues: string[] = [];
  let confidence = 0.9;

  const client = getClient();

  // Check verification records
  const { data: records } = await client
    .from("verification_records")
    .select("verification_date, confidence, notes")
    .eq("listing_id", listing.id)
    .order("verification_date", { ascending: false })
    .limit(5);

  if (!records || records.length === 0) {
    issues.push("No verification records found");
    confidence -= 0.3;
  } else {
    const latest = records[0] as VerificationRecord;
    const daysSinceVerification = Math.floor(
      (Date.now() - new Date(latest.verification_date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSinceVerification > 90) {
      issues.push(`Verification is ${daysSinceVerification} days old`);
      confidence -= 0.2;
    } else if (daysSinceVerification > 30) {
      issues.push(`Verification is ${daysSinceVerification} days old`);
      confidence -= 0.1;
    }

    if (Number(latest.confidence) < 0.5) {
      issues.push("Low verification confidence");
      confidence -= 0.15;
    }
  }

  // Check for duplicate listings
  const { data: duplicates } = await client
    .from("listings")
    .select("id")
    .eq("title", listing.title)
    .neq("id", listing.id);

  if (duplicates && duplicates.length > 0) {
    issues.push("Possible duplicate listing detected");
    confidence -= 0.2;
  }

  // Rule-based checks
  if (listing.price <= 0) {
    issues.push("Invalid price detected");
    confidence -= 0.3;
  }

  if (listing.distance < 0) {
    issues.push("Invalid distance detected");
    confidence -= 0.2;
  }

  if (!listing.title || listing.title.trim() === "") {
    issues.push("Missing title");
    confidence -= 0.1;
  }

  if (
    listing.reviewScore !== null &&
    (listing.reviewScore < 0 || listing.reviewScore > 5)
  ) {
    issues.push("Invalid review score");
    confidence -= 0.1;
  }

  return {
    listingId: listing.id,
    confidence: Math.max(0, Math.min(1, confidence)),
    issues,
  };
}

/**
 * Verify multiple listings.
 */
export async function verifyListings(
  listings: Listing[]
): Promise<VerificationResult[]> {
  const results = await Promise.all(listings.map(verifyListing));
  return results;
}

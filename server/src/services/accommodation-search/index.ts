/**
 * Accommodation Search Service
 *
 * Deterministic database queries for finding accommodation.
 * This service does NOT call OpenAI — it only queries Supabase.
 */

import getClient from "../supabase.js";
import type { SearchCriteria, Listing, HostelCategory } from "../../types/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseRow = Record<string, any>;

/**
 * Search for accommodation listings using Supabase.
 * Applies deterministic filters based on search criteria.
 */
export async function searchAccommodation(
  criteria: SearchCriteria
): Promise<Listing[]> {
  const client = getClient();
  let query = client
    .from("listings")
    .select(`
      id,
      title,
      description,
      university,
      location,
      area,
      price,
      distance,
      wifi,
      bathrooms,
      kitchen,
      gender,
      noise_level,
      category,
      amenities,
      created_at,
      images!inner(url),
      reviews(rating),
      verification_records(confidence)
    `);

  // Apply deterministic filters
  if (criteria.university) {
    query = query.eq("university", criteria.university);
  }

  if (criteria.budget !== null && criteria.budget !== undefined) {
    query = query.lte("price", criteria.budget);
  }

  if (criteria.gender) {
    query = query.or(`gender.eq.${criteria.gender},gender.eq.mixed`);
  }

  if (criteria.distance !== null && criteria.distance !== undefined) {
    query = query.lte("distance", criteria.distance);
  }

  if (criteria.category) {
    query = query.eq("category", criteria.category);
  }

  if (criteria.amenities.includes("wifi")) {
    query = query.eq("wifi", true);
  }

  if (criteria.amenities.includes("kitchen")) {
    query = query.eq("kitchen", true);
  }

  // Filter by amenities array contains
  for (const amenity of criteria.amenities) {
    if (!["wifi", "kitchen"].includes(amenity)) {
      query = query.contains("amenities", [amenity]);
    }
  }

  // Order by price and limit results
  query = query.order("price", { ascending: true }).limit(20);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  return mapListings(data ?? []);
}

/**
 * Get a listing by ID.
 */
export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await getClient()
    .from("listings")
    .select(`
      id,
      title,
      description,
      university,
      location,
      area,
      price,
      distance,
      wifi,
      bathrooms,
      kitchen,
      gender,
      noise_level,
      category,
      amenities,
      created_at,
      images!inner(url),
      reviews(rating),
      verification_records(confidence)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const listings = mapListings([data]);
  return listings[0] ?? null;
}

/**
 * Get all listings (for broader searches).
 */
export async function getAllListings(): Promise<Listing[]> {
  const { data, error } = await getClient()
    .from("listings")
    .select(`
      id,
      title,
      description,
      university,
      location,
      area,
      price,
      distance,
      wifi,
      bathrooms,
      kitchen,
      gender,
      noise_level,
      category,
      amenities,
      created_at,
      images!inner(url),
      reviews(rating),
      verification_records(confidence)
    `)
    .order("price", { ascending: true })
    .limit(50);

  if (error) {
    throw new Error(`Failed to fetch listings: ${error.message}`);
  }

  return mapListings(data ?? []);
}

/**
 * Map database rows to Listing type.
 * Handles nested Supabase join results.
 */
function mapListings(rows: SupabaseRow[]): Listing[] {
  return rows.map((row) => {
    // Extract images from nested join
    const images = row.images
      ? (Array.isArray(row.images) ? row.images : [row.images])
          .map((img: SupabaseRow) => img?.url)
          .filter(Boolean)
      : [];

    // Extract review score from nested reviews
    const reviews = row.reviews
      ? (Array.isArray(row.reviews) ? row.reviews : [row.reviews])
      : [];
    const reviewScore = reviews.length > 0
      ? reviews.reduce((sum: number, r: SupabaseRow) => sum + (r?.rating ?? 0), 0) / reviews.length
      : null;

    // Extract verification score from nested verification_records
    const verificationRecords = row.verification_records
      ? (Array.isArray(row.verification_records) ? row.verification_records : [row.verification_records])
      : [];
    const verificationScore = verificationRecords.length > 0
      ? verificationRecords[0]?.confidence ?? null
      : null;

    // Parse amenities (Supabase returns as array or JSON string)
    let amenities: string[] = [];
    if (Array.isArray(row.amenities)) {
      amenities = row.amenities;
    } else if (typeof row.amenities === "string") {
      try {
        amenities = JSON.parse(row.amenities);
      } catch {
        amenities = [];
      }
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      university: row.university,
      location: row.location,
      area: row.area ?? "",
      price: Number(row.price),
      distance: Number(row.distance),
      wifi: row.wifi,
      bathrooms: row.bathrooms,
      kitchen: row.kitchen,
      gender: row.gender,
      noiseLevel: row.noise_level,
      category: (row.category as HostelCategory) ?? "budget",
      amenities,
      images,
      reviewScore: reviewScore !== null ? Number(reviewScore) : null,
      verificationScore: verificationScore !== null ? Number(verificationScore) : null,
      createdAt: row.created_at,
    };
  });
}

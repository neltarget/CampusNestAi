/**
 * Shared types for CampusNest AI client.
 *
 * Types matching server responses and internal UI state.
 */

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------

export type UserRole = "student" | "landlord";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchHistoryItem {
  id: string;
  user_id: string;
  search_query: string;
  structured_search: SearchCriteria | null;
  recommendations: RankedListing[] | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Search types
// ---------------------------------------------------------------------------

export type HostelCategory = "budget" | "mid_range" | "premium" | "luxury";

export interface SearchCriteria {
  university: string;
  budget: number | null;
  gender: string | null;
  roomType: string | null;
  preferences: string[];
  amenities: string[];
  distance: number | null;
  category: HostelCategory | null;
}

export interface Listing {
  id: string;
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
  category: HostelCategory;
  amenities: string[];
  images: string[];
  reviewScore: number | null;
  verificationScore: number | null;
  createdAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  rating: number;
  comment: string;
}

export interface VerificationRecord {
  id: string;
  listingId: string;
  verificationDate: string;
  confidence: number;
  notes: string;
}

// ---------------------------------------------------------------------------
// Pipeline types (matching server)
// ---------------------------------------------------------------------------

export interface RankedListing {
  listing: Listing;
  score: number;
  reason: string;
}

export interface VerificationResult {
  listingId: string;
  confidence: number;
  issues: string[];
}

export interface Explanation {
  listingId: string;
  summary: string;
  tradeoffs: string[];
}

export interface OrchestratorStage {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  duration?: number;
  error?: string;
}

export interface SearchResult {
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

// ---------------------------------------------------------------------------
// SSE Event types
// ---------------------------------------------------------------------------

export interface StageEvent {
  type: "stage:started" | "stage:completed" | "stage:failed" | "search:done";
  data: Record<string, unknown>;
}

export interface StageStepState {
  stage: string;
  status: "pending" | "running" | "completed" | "failed";
  output?: unknown;
  duration?: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

// ---------------------------------------------------------------------------
// Listing Worker types
// ---------------------------------------------------------------------------

export interface ParsedListing {
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
  category: HostelCategory;
  amenities: string[];
}

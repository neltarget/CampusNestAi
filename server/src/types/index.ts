/**
 * Shared types for CampusNest AI server.
 */

export interface SearchCriteria {
  university: string;
  budget: number | null;
  gender: string | null;
  roomType: string | null;
  preferences: string[];
  amenities: string[];
  distance: number | null;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  university: string;
  location: string;
  price: number;
  distance: number;
  wifi: boolean;
  bathrooms: number;
  kitchen: boolean;
  gender: string;
  noiseLevel: string;
  images: string[];
  reviewScore: number | null;
  verificationScore: number | null;
  createdAt: string;
}

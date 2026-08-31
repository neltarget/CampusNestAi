import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Wifi,
  UtensilsCrossed,
  Clock,
  Users,
  Volume2,
  Star,
  ShieldCheck,
} from "lucide-react";
import { VerificationBadge } from "../components/VerificationBadge";
import { getListingById } from "../services/api";
import type { Listing, Review, VerificationRecord, HostelCategory } from "../types";

export function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [verification, setVerification] = useState<VerificationRecord | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchListing() {
      setLoading(true);
      const data = await getListingById(id!);
      if (cancelled) return;

      if (!data) {
        setError(true);
        setLoading(false);
        return;
      }

      const raw = data.listing;
      setListing({
        id: String(raw.id),
        title: String(raw.title),
        description: String(raw.description),
        university: String(raw.university),
        location: String(raw.location),
        area: String(raw.area ?? ""),
        price: Number(raw.price),
        distance: Number(raw.distance),
        wifi: Boolean(raw.wifi),
        bathrooms: Number(raw.bathrooms),
        kitchen: Boolean(raw.kitchen),
        gender: String(raw.gender),
        noiseLevel: String(raw.noiseLevel),
        category: ((raw.category as HostelCategory) ?? "mid_range"),
        amenities: Array.isArray(raw.amenities)
          ? raw.amenities.map((a: unknown) => String(a)).filter(Boolean)
          : [],
        images: Array.isArray(raw.images)
          ? raw.images.map((i: unknown) => String(i)).filter(Boolean)
          : raw.images
            ? [String(raw.images)]
            : [],
        reviewScore:
          typeof raw.reviewScore === "number" ? raw.reviewScore : null,
        verificationScore:
          typeof raw.verificationScore === "number"
            ? raw.verificationScore
            : null,
        createdAt: String(raw.createdAt),
      });

      setReviews(
        data.reviews.map((r) => ({
          id: String(r.id),
          listingId: String(r.listingId),
          rating: Number(r.rating),
          comment: String(r.comment),
        }))
      );

      if (data.verification) {
        setVerification({
          id: String(data.verification.id),
          listingId: String(data.verification.listingId),
          verificationDate: String(data.verification.verificationDate),
          confidence: Number(data.verification.confidence),
          notes: String(data.verification.notes),
        });
      }

      setLoading(false);
    }

    fetchListing();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-500">Loading listing...</span>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-2xl font-bold text-gray-900">
          Listing not found
        </h2>
        <p className="mt-2 text-gray-500">
          The listing you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/results"
          className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link
              to="/"
              className="hover:text-emerald-600 transition-all duration-200"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/results"
              className="hover:text-emerald-600 transition-all duration-200"
            >
              Listings
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{listing.title}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={
                listing.images[0] ||
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop"
              }
              alt={listing.title}
              className="h-80 w-full object-cover"
            />
          </div>

          {/* Title and Badge */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                {listing.title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location}, near {listing.university}
                </span>
                <span>|</span>
                <span>{listing.distance} km from campus</span>
              </div>
            </div>
            <VerificationBadge score={listing.verificationScore} />
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Description
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Amenities
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {listing.wifi && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Wifi className="h-5 w-5 text-emerald-500" />
                  WiFi Available
                </div>
              )}
              {listing.kitchen && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                  Kitchen
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="h-5 w-5 text-blue-500" />
                {listing.bathrooms} Bathroom{listing.bathrooms > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users className="h-5 w-5 text-purple-500" />
                {listing.gender === "mixed"
                  ? "Mixed Gender"
                  : listing.gender === "female"
                    ? "Female Only"
                    : "Male Only"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Volume2 className="h-5 w-5 text-green-500" />
                {listing.noiseLevel === "quiet"
                  ? "Quiet Area"
                  : listing.noiseLevel === "moderate"
                    ? "Moderate Noise"
                    : "Lively Area"}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No reviews yet for this listing.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
            <div className="text-center">
              <span className="text-3xl font-bold text-emerald-600">
                GHS {listing.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/year</span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Distance</span>
                <span className="font-medium text-gray-900">
                  {listing.distance} km
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">WiFi</span>
                <span className="font-medium text-gray-900">
                  {listing.wifi ? "Included" : "Not available"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Kitchen</span>
                <span className="font-medium text-gray-900">
                  {listing.kitchen ? "Available" : "Not available"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Bathrooms</span>
                <span className="font-medium text-gray-900">
                  {listing.bathrooms}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium text-gray-900 capitalize">
                  {listing.gender}
                </span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-lg">
              Contact Landlord
            </button>
          </div>

          {/* Verification Info */}
          {verification && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="font-display text-sm font-semibold text-gray-900">
                  Verification Details
                </h3>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Confidence</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(verification.confidence * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last verified</span>
                  <span className="font-medium text-gray-900">
                    {new Date(
                      verification.verificationDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {verification.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

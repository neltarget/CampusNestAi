import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { VerificationBadge } from "../components/VerificationBadge";
import { getListingById } from "../services/api";
import type { Listing, Review, VerificationRecord } from "../types";

export function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [verification, setVerification] = useState<VerificationRecord | null>(null);
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
        price: Number(raw.price),
        distance: Number(raw.distance),
        wifi: Boolean(raw.wifi),
        bathrooms: Number(raw.bathrooms),
        kitchen: Boolean(raw.kitchen),
        gender: String(raw.gender),
        noiseLevel: String(raw.noiseLevel),
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
          <div className="h-5 w-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-500">Loading listing...</span>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
        <p className="mt-2 text-gray-500">
          The listing you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/results"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
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
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/results"
              className="hover:text-indigo-600 transition-colors"
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
          <div className="overflow-hidden rounded-xl bg-gray-100">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {listing.title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  {listing.location}, near {listing.university}
                </span>
                <span>|</span>
                <span>{listing.distance} km from campus</span>
              </div>
            </div>
            <VerificationBadge score={listing.verificationScore} />
          </div>

          {/* Description */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Description
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {listing.wifi && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg
                    className="h-5 w-5 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0"
                    />
                  </svg>
                  WiFi Available
                </div>
              )}
              {listing.kitchen && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg
                    className="h-5 w-5 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
                    />
                  </svg>
                  Kitchen
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {listing.bathrooms} Bathroom{listing.bathrooms > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="h-5 w-5 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"
                  />
                </svg>
                {listing.gender === "mixed"
                  ? "Mixed Gender"
                  : listing.gender === "female"
                    ? "Female Only"
                    : "Male Only"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5"
                  />
                </svg>
                {listing.noiseLevel === "quiet"
                  ? "Quiet Area"
                  : listing.noiseLevel === "moderate"
                    ? "Moderate Noise"
                    : "Lively Area"}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
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
                    className="rounded-lg border border-gray-100 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.73 1.397 1.494 1.397 1.262 0 1.798-.584 1.494-1.397l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                              clipRule="evenodd"
                            />
                          </svg>
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
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <span className="text-3xl font-bold text-indigo-600">
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

            <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
              Contact Landlord
            </button>
          </div>

          {/* Verification Info */}
          {verification && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Verification Details
              </h3>
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

import { Link } from "react-router-dom";
import type { Listing, VerificationResult } from "../types";
import { VerificationBadge } from "./VerificationBadge";

interface RecommendationCardProps {
  listing: Listing;
  rank: number;
  explanation: string;
  score: number;
  tradeoffs: string[];
  verification?: VerificationResult;
  workerReason: string;
}

export function RecommendationCard({
  listing,
  rank,
  explanation,
  score,
  tradeoffs,
  verification,
  workerReason,
}: RecommendationCardProps) {
  const confidenceColor =
    verification && verification.confidence >= 0.8
      ? "text-green-600 bg-green-50"
      : verification && verification.confidence >= 0.5
        ? "text-yellow-600 bg-yellow-50"
        : "text-red-600 bg-red-50";

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden bg-gray-100">
          <img
            src={
              listing.images[0] ||
              "https://picsum.photos/seed/placeholder/800/600"
            }
            alt={listing.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {rank}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/listing/${listing.id}`}
              className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              {listing.title}
            </Link>
            <VerificationBadge score={listing.verificationScore} />
          </div>

          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {explanation}
          </p>

          {/* Worker Reason */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                />
              </svg>
              {workerReason}
            </span>
          </div>

          {/* Tradeoffs */}
          {tradeoffs.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tradeoffs.map((tradeoff) => (
                <span
                  key={tradeoff}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tradeoff}
                </span>
              ))}
            </div>
          )}

          {/* Verification Details */}
          {verification && verification.issues.length > 0 && (
            <div className="mt-2 rounded-lg bg-yellow-50 p-2">
              <p className="text-xs font-medium text-yellow-800">Issues detected:</p>
              <ul className="mt-1 space-y-0.5">
                {verification.issues.map((issue) => (
                  <li
                    key={issue}
                    className="text-xs text-yellow-700 flex items-start gap-1"
                  >
                    <span className="mt-1 h-1 w-1 rounded-full bg-yellow-500 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-lg font-bold text-indigo-600">
              GHS {listing.price.toLocaleString()}
              <span className="text-xs font-normal text-gray-500">/year</span>
            </span>

            <div className="flex items-center gap-2">
              {verification && (
                <div
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${confidenceColor}`}
                >
                  <span className="text-xs font-medium">Confidence</span>
                  <span className="text-sm font-bold">
                    {Math.round(verification.confidence * 100)}%
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1">
                <span className="text-xs font-medium text-indigo-700">
                  Match
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {Math.round(score * 100)}%
                </span>
              </div>

              <Link
                to={`/listing/${listing.id}`}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import type { Listing, VerificationResult } from "../types";
import { VerificationBadge } from "./VerificationBadge";
import { Sparkles, ArrowRight, AlertTriangle, MapPin } from "lucide-react";

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
      ? "text-emerald-700 bg-emerald-50"
      : verification && verification.confidence >= 0.5
        ? "text-amber-700 bg-amber-50"
        : "text-red-700 bg-red-50";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft hover:shadow-medium transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 sm:h-auto sm:w-44 shrink-0 overflow-hidden bg-gray-100">
          <img
            src={
              listing.images[0] ||
              "https://picsum.photos/seed/placeholder/800/600"
            }
            alt={listing.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-white shadow-sm">
            {rank}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Link
                to={`/listing/${listing.id}`}
                className="text-base font-semibold text-gray-900 hover:text-emerald-600 transition-colors font-display"
              >
                {listing.title}
              </Link>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {listing.location}
              </div>
            </div>
            <VerificationBadge score={listing.verificationScore} />
          </div>

          <p className="mt-2.5 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {explanation}
          </p>

          {/* Worker Reason */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <Sparkles className="h-3 w-3" />
              {workerReason}
            </span>
          </div>

          {/* Tradeoffs */}
          {tradeoffs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tradeoffs.map((tradeoff) => (
                <span
                  key={tradeoff}
                  className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-100"
                >
                  {tradeoff}
                </span>
              ))}
            </div>
          )}

          {/* Verification Details */}
          {verification && verification.issues.length > 0 && (
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <p className="text-xs font-semibold text-amber-800">
                  Issues detected
                </p>
              </div>
              <ul className="mt-1.5 space-y-0.5">
                {verification.issues.map((issue) => (
                  <li
                    key={issue}
                    className="text-xs text-amber-700 flex items-start gap-1.5"
                  >
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <span className="text-lg font-bold text-gray-900">
              GHS {listing.price.toLocaleString()}
              <span className="text-xs font-normal text-gray-400 ml-0.5">
                /year
              </span>
            </span>

            <div className="flex items-center gap-2">
              {verification && (
                <div
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 ${confidenceColor}`}
                >
                  <span className="text-xs font-medium">Confidence</span>
                  <span className="text-sm font-bold">
                    {Math.round(verification.confidence * 100)}%
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1">
                <span className="text-xs font-medium text-emerald-700">
                  Match
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {Math.round(score * 100)}%
                </span>
              </div>

              <Link
                to={`/listing/${listing.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                View
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import type { Listing } from "../types";
import { VerificationBadge } from "./VerificationBadge";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={listing.images[0] || "https://picsum.photos/seed/placeholder/800/600"}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <VerificationBadge score={listing.verificationScore} />
        </div>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {listing.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span>{listing.location}</span>
          <span className="text-gray-300">|</span>
          <span>{listing.distance} km from campus</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg font-bold text-indigo-600">
            GHS {listing.price.toLocaleString()}
            <span className="text-xs font-normal text-gray-500">/year</span>
          </span>

          <div className="ml-auto flex items-center gap-2">
            {listing.wifi && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
                </svg>
                WiFi
              </span>
            )}
            {listing.kitchen && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
                Kitchen
              </span>
            )}
          </div>
        </div>

        {listing.reviewScore !== null && (
          <div className="mt-3 flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= Math.round(listing.reviewScore!)
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
            <span className="text-xs text-gray-500">
              {listing.reviewScore.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

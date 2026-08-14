import { Link } from "react-router-dom";
import type { Listing } from "../types";
import { VerificationBadge } from "./VerificationBadge";
import { MapPin, Wifi, UtensilsCrossed, Star } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft hover:shadow-elevated hover:border-gray-200 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={
            listing.images[0] ||
            "https://picsum.photos/seed/placeholder/800/600"
          }
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <VerificationBadge score={listing.verificationScore} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1 font-display">
          {listing.title}
        </h3>

        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          <span>{listing.location}</span>
          <span className="text-gray-300">&middot;</span>
          <span>{listing.distance} km from campus</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            GHS {listing.price.toLocaleString()}
            <span className="text-xs font-normal text-gray-400 ml-0.5">
              /year
            </span>
          </span>

          <div className="flex items-center gap-2">
            {listing.wifi && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                <Wifi className="h-3 w-3" />
                WiFi
              </span>
            )}
            {listing.kitchen && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                <UtensilsCrossed className="h-3 w-3" />
                Kitchen
              </span>
            )}
          </div>
        </div>

        {listing.reviewScore !== null && (
          <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= Math.round(listing.reviewScore!)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-500">
              {listing.reviewScore.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

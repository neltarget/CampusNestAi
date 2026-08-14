import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ListingCard } from "../components/ListingCard";
import { getAllListings } from "../services/api";
import type { Listing } from "../types";

export function ResultsPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [wifiOnly, setWifiOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      const listings = await getAllListings();
      if (!cancelled) {
        setAllListings(listings);
        setLoading(false);
      }
    }
    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  const locations = [...new Set(allListings.map((l) => l.location))];
  const priceRanges = [
    { label: "Under GHS 4,000", min: 0, max: 4000 },
    { label: "GHS 4,000 - 6,000", min: 4000, max: 6000 },
    { label: "GHS 6,000 - 8,000", min: 6000, max: 8000 },
    { label: "Over GHS 8,000", min: 8000, max: Infinity },
  ];

  const filteredListings = allListings.filter((listing) => {
    if (selectedLocation !== "all" && listing.location !== selectedLocation) {
      return false;
    }
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range && (listing.price < range.min || listing.price >= range.max)) {
        return false;
      }
    }
    if (wifiOnly && !listing.wifi) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                <h3 className="font-display text-sm font-semibold text-gray-900">
                  Filters
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all duration-200"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Price Range
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all duration-200"
                  >
                    <option value="all">Any Price</option>
                    {priceRanges.map((range) => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={wifiOnly}
                      onChange={(e) => setWifiOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">WiFi required</span>
                  </label>
                </div>

                <button
                  onClick={() => {
                    setSelectedLocation("all");
                    setSelectedPriceRange("all");
                    setWifiOnly(false);
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              All Listings
            </h2>
            <span className="text-sm text-gray-500">
              {loading ? "Loading..." : `${filteredListings.length} results`}
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-elevated">
              <div className="inline-flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                <span className="text-sm text-gray-500">
                  Loading listings...
                </span>
              </div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-elevated">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="font-display mt-4 text-sm font-semibold text-gray-900">
                No listings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

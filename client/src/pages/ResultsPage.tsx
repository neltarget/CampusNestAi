import { useState } from "react";
import { ListingCard } from "../components/ListingCard";
import { mockListings } from "../data/mock";

const locations = [...new Set(mockListings.map((l) => l.location))];
const priceRanges = [
  { label: "Under GHS 2,000", min: 0, max: 2000 },
  { label: "GHS 2,000 - 4,000", min: 2000, max: 4000 },
  { label: "GHS 4,000 - 6,000", min: 4000, max: 6000 },
  { label: "Over GHS 6,000", min: 6000, max: Infinity },
];

export function ResultsPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [wifiOnly, setWifiOnly] = useState(false);

  const filteredListings = mockListings.filter((listing) => {
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
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Location</h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
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
              <h3 className="text-sm font-semibold text-gray-900">
                Price Range
              </h3>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
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
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              All Listings
            </h2>
            <span className="text-sm text-gray-500">
              {filteredListings.length} results
            </span>
          </div>

          {filteredListings.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
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

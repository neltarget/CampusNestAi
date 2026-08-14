import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Plus,
  RotateCcw,
} from "lucide-react";
import { parseListing, createListing } from "../services/api";
import type { ParsedListing } from "../types";

export function ListingWorkerPage() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<ParsedListing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleParse = async () => {
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSuccess(false);

    try {
      const response = (await parseListing(description)) as {
        success: boolean;
        output: ParsedListing;
        error?: string;
      };

      if (response.success) {
        setResult(response.output);
      } else {
        setError(response.error ?? "Failed to parse listing");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!result) return;

    setSaving(true);
    setError(null);

    try {
      const response = await createListing({
        title: result.title,
        description: result.description,
        university: result.university,
        location: result.location,
        price: result.price,
        distance: result.distance,
        wifi: result.wifi,
        bathrooms: result.bathrooms,
        kitchen: result.kitchen,
        gender: result.gender,
        noiseLevel: result.noiseLevel,
      });

      if (response.success && response.listingId) {
        setSuccess(true);
        setTimeout(() => navigate(`/listing/${response.listingId}`), 1500);
      } else {
        setError(response.error ?? "Failed to create listing");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDescription("");
    setResult(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Create Listing
        </h1>
        <p className="mt-2 text-gray-600">
          Describe your accommodation in natural language and our AI will
          convert it into a structured listing.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Accommodation Description
        </label>
        <textarea
          id="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Spacious single room near KNUST campus. Includes bed, wardrobe, and ceiling fan. Shared bathroom and kitchen. WiFi available. GHS 2,500 per year. Quiet neighborhood."
          className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none transition-all duration-200"
        />

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleParse}
            disabled={!description.trim() || loading}
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Parsing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Parse with AI
              </>
            )}
          </button>
          {result && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-elevated">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 shadow-elevated">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-800">
              Listing created! Redirecting...
            </span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-elevated">
          <h3 className="font-display text-sm font-semibold text-gray-900 mb-4">
            Parsed Listing
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-500">
                Title
              </label>
              <p className="mt-1 text-sm text-gray-900">{result.title}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                University
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {result.university}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Location
              </label>
              <p className="mt-1 text-sm text-gray-900">{result.location}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Price
              </label>
              <p className="mt-1 text-sm text-gray-900">
                GHS {result.price.toLocaleString()}/year
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Distance
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {result.distance} km
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                WiFi
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {result.wifi ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Bathrooms
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {result.bathrooms}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Kitchen
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {result.kitchen ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Gender
              </label>
              <p className="mt-1 text-sm text-gray-900 capitalize">
                {result.gender}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Noise Level
              </label>
              <p className="mt-1 text-sm text-gray-900 capitalize">
                {result.noiseLevel}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-medium text-gray-500">
              Description
            </label>
            <p className="mt-1 text-sm text-gray-900">{result.description}</p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Listing
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

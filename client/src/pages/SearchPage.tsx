import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { SearchBox } from "../components/SearchBox";
import { useAuth } from "../contexts/AuthContext";
import { StageTimeline } from "../components/StageTimeline";
import { StageOutputPanel } from "../components/StageOutputPanel";
import { RecommendationCard } from "../components/RecommendationCard";
import { VerificationSummary } from "../components/VerificationSummary";
import { PipelineSummary } from "../components/PipelineSummary";
import { searchAccommodationStream, saveSearchHistory } from "../services/api";
import type {
  SearchResult,
  StageStepState,
  Explanation,
  VerificationResult,
} from "../types";

type SearchPhase = "idle" | "processing" | "results";

const PIPELINE_STAGES = [
  "intent",
  "search",
  "ranking",
  "verification",
  "ai_reasoning",
  "recommendation",
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState<SearchPhase>("idle");
  const [stages, setStages] = useState<StageStepState[]>([]);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const searchingRef = useRef(false);

  const initialQuery = searchParams.get("q") || "";

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const startSearch = useCallback((query: string) => {
    if (searchingRef.current) return;
    searchingRef.current = true;

    setPhase("processing");
    setResult(null);
    setError(null);
    setSelectedStage(null);
    setStages(
      PIPELINE_STAGES.map((name) => ({
        stage: name,
        status: "pending" as const,
      }))
    );

    cleanupRef.current?.();
    cleanupRef.current = searchAccommodationStream(
      query,
      (event) => {
        switch (event.type) {
          case "stage:started": {
            const stageName = event.data.stage as string;
            setStages((prev) =>
              prev.map((s) =>
                s.stage === stageName
                  ? {
                      ...s,
                      status: "running" as const,
                      startedAt: event.data.timestamp as string,
                    }
                  : s
              )
            );
            setSelectedStage(stageName);
            break;
          }

          case "stage:completed": {
            const stageName = event.data.stage as string;
            setStages((prev) =>
              prev.map((s) =>
                s.stage === stageName
                  ? {
                      ...s,
                      status: "completed" as const,
                      duration: event.data.duration as number,
                      completedAt: event.data.timestamp as string,
                    }
                  : s
              )
            );
            break;
          }

          case "stage:failed": {
            const stageName = event.data.stage as string;
            setStages((prev) =>
              prev.map((s) =>
                s.stage === stageName
                  ? {
                      ...s,
                      status: "failed" as const,
                      error: event.data.error as string,
                    }
                  : s
              )
            );
            break;
          }

          case "search:done": {
            const searchResult = event.data as unknown as SearchResult;
            if (!searchResult.success) {
              setError(searchResult.error || "Search failed");
              setPhase("idle");
            } else {
              setResult(searchResult);
              setPhase("results");
              saveSearchHistory(
                query,
                searchResult.explanation,
                searchResult.listings.map((r) => ({
                  listingId: r.listing.id,
                  title: r.listing.title,
                  score: r.score,
                }))
              ).catch(() => {});
            }
            searchingRef.current = false;
            break;
          }
        }
      },
      (err) => {
        console.error("SSE error:", err);
        setError(
          "Failed to connect to search service. Make sure the server is running."
        );
        setPhase("idle");
        searchingRef.current = false;
      }
    );
  }, []);

  useEffect(() => {
    if (initialQuery) {
      startSearch(initialQuery);
    }
  }, [initialQuery, startSearch]);

  const handleSearch = (query: string) => {
    if (!user) {
      navigate("/login", { state: { from: "/search", searchQuery: query } });
      return;
    }
    setSearchParams({ q: query }, { replace: true });
    startSearch(query);
  };

  const getExplanationForListing = (
    listingId: string
  ): Explanation | undefined =>
    result?.explanations.find((e) => e.listingId === listingId);

  const getVerificationForListing = (
    listingId: string
  ): VerificationResult | undefined =>
    result?.verifications.find((v) => v.listingId === listingId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SearchBox
          onSearch={handleSearch}
          disabled={phase === "processing"}
          placeholder="Describe your ideal accommodation..."
        />
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-elevated">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Search failed
                </p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "processing" && (
        <div className="mt-10">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-sm font-medium text-emerald-600">
                AI is analyzing your request...
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <StageTimeline
                stages={stages}
                onSelect={setSelectedStage}
                selectedStage={selectedStage}
              />
            </div>
            <div className="lg:col-span-2">
              <StageOutputPanel
                stages={stages}
                selectedStage={selectedStage}
                onSelect={setSelectedStage}
              />
            </div>
          </div>
        </div>
      )}

      {phase === "results" && result && (
        <div className="mt-10">
          <PipelineSummary
            stages={result.stages}
            duration={result.duration}
            totalListings={result.listings.length}
            explanation={result.explanation}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-gray-900">
                  Top Recommendations
                </h2>
                <span className="text-sm text-gray-500">
                  {result.listings.length} results found
                </span>
              </div>
              <div className="space-y-4">
                {result.listings.map((rank, index) => {
                  const explanation = getExplanationForListing(
                    rank.listing.id
                  );
                  const verification = getVerificationForListing(
                    rank.listing.id
                  );
                  return (
                    <RecommendationCard
                      key={rank.listing.id}
                      listing={rank.listing}
                      rank={index + 1}
                      explanation={
                        explanation?.summary ?? "No explanation available"
                      }
                      score={rank.score}
                      tradeoffs={explanation?.tradeoffs ?? []}
                      verification={verification}
                      workerReason={rank.reason}
                    />
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <VerificationSummary verifications={result.verifications} />

              <StageTimeline
                stages={stages}
                onSelect={setSelectedStage}
                selectedStage={selectedStage}
                compact
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

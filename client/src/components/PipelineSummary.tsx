import { Check, X, ArrowRight, Clock, Building2, AlertCircle } from "lucide-react";
import type { OrchestratorStage } from "../types";

interface PipelineSummaryProps {
  stages: OrchestratorStage[];
  duration: number;
  totalListings: number;
  explanation: string;
}

const STAGE_NAMES: Record<string, string> = {
  intent: "Intent",
  search: "Search",
  ranking: "Ranking",
  verification: "Verification",
  ai_reasoning: "AI Reasoning",
  recommendation: "Recommendation",
};

export function PipelineSummary({
  stages,
  duration,
  totalListings,
  explanation,
}: PipelineSummaryProps) {
  const completedStages = stages.filter((s) => s.status === "completed").length;
  const failedStages = stages.filter((s) => s.status === "failed").length;
  const totalStages = stages.filter(
    (s) => s.status === "completed" || s.status === "failed"
  ).length;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold font-display text-gray-900">
            AI Processing Complete
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {completedStages}/{totalStages} stages completed successfully
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
              <Clock className="h-3 w-3" />
              Duration
            </div>
            <p className="text-sm font-semibold text-gray-900">{duration}ms</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
              <Building2 className="h-3 w-3" />
              Results
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {totalListings} listings
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {stages
          .filter(
            (s) => s.status === "completed" || s.status === "failed"
          )
          .map((stage, index) => {
            const name = STAGE_NAMES[stage.name] ?? stage.name;
            const isLast =
              index ===
              stages.filter(
                (s) => s.status === "completed" || s.status === "failed"
              ).length -
                1;

            return (
              <div key={`${stage.name}`} className="flex items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${
                    stage.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stage.status === "completed" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  {name}
                  {stage.duration !== undefined && (
                    <span className="text-xs opacity-70">
                      {stage.duration}ms
                    </span>
                  )}
                </div>
                {!isLast && (
                  <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
                )}
              </div>
            );
          })}
      </div>

      {failedStages > 0 && (
        <div className="mt-3 rounded-xl bg-red-50 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-700">
              {failedStages} stage(s) failed. Results may be incomplete.
            </p>
          </div>
        </div>
      )}

      {explanation && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3">
          <p className="text-xs font-medium text-emerald-800 mb-1">AI Summary</p>
          <p className="text-sm text-emerald-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}

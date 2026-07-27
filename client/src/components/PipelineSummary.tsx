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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            AI Processing Complete
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {completedStages}/{totalStages} stages completed successfully
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-semibold text-gray-900">{duration}ms</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Results</p>
            <p className="text-sm font-semibold text-gray-900">
              {totalListings} listings
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
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
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    stage.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stage.status === "completed" ? (
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  {name}
                  {stage.duration !== undefined && (
                    <span className="text-xs opacity-70">
                      {stage.duration}ms
                    </span>
                  )}
                </div>
                {!isLast && (
                  <svg
                    className="h-4 w-4 text-gray-300 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                )}
              </div>
            );
          })}
      </div>

      {failedStages > 0 && (
        <div className="mt-3 rounded-lg bg-red-50 p-3">
          <p className="text-xs text-red-700">
            {failedStages} stage(s) failed. Results may be incomplete.
          </p>
        </div>
      )}

      {explanation && (
        <div className="mt-4 rounded-lg bg-indigo-50 p-3">
          <p className="text-xs font-medium text-indigo-800 mb-1">AI Summary</p>
          <p className="text-sm text-indigo-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}

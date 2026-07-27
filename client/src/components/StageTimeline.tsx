import type { StageStepState } from "../types";

interface StageTimelineProps {
  stages: StageStepState[];
  onSelect: (stage: string) => void;
  selectedStage: string | null;
  compact?: boolean;
}

const STAGE_ICONS: Record<string, string> = {
  intent: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
  search: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
  ranking: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  verification: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  ai_reasoning: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
  recommendation: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
};

const STAGE_LABELS: Record<string, string> = {
  intent: "Intent Analysis",
  search: "Database Search",
  ranking: "Ranking",
  verification: "Verification",
  ai_reasoning: "AI Reasoning",
  recommendation: "Recommendation",
};

function getStatusStyles(status: StageStepState["status"]): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (status) {
    case "completed":
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: "text-green-600",
      };
    case "running":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
        icon: "text-indigo-600",
      };
    case "failed":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: "text-red-600",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-400",
        border: "border-gray-200",
        icon: "text-gray-300",
      };
  }
}

export function StageTimeline({
  stages,
  onSelect,
  selectedStage,
  compact = false,
}: StageTimelineProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        AI Processing Stages
      </h3>

      <div className="space-y-0">
        {stages.map((stage, index) => {
          const styles = getStatusStyles(stage.status);
          const isSelected = selectedStage === stage.stage;
          const icon = STAGE_ICONS[stage.stage] ?? "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605";

          return (
            <div key={stage.stage}>
              <button
                onClick={() => onSelect(stage.stage)}
                className={`w-full flex items-center gap-3 rounded-lg p-2.5 text-left transition-all ${
                  isSelected
                    ? `${styles.bg} ring-2 ring-indigo-500`
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.bg} ${styles.border} border`}
                  >
                    {stage.status === "completed" ? (
                      <svg
                        className="h-4 w-4 text-green-600"
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
                    ) : stage.status === "running" ? (
                      <div className="h-3 w-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    ) : stage.status === "failed" ? (
                      <svg
                        className="h-4 w-4 text-red-500"
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
                    ) : (
                      <svg
                        className={`h-4 w-4 ${styles.icon}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={icon}
                        />
                      </svg>
                    )}
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`mt-1 h-4 w-0.5 ${
                        stage.status === "completed"
                          ? "bg-green-200"
                          : stage.status === "running"
                            ? "bg-indigo-200"
                            : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        stage.status === "completed"
                          ? "text-green-700"
                          : stage.status === "running"
                            ? "text-indigo-700"
                            : stage.status === "failed"
                              ? "text-red-600"
                              : "text-gray-400"
                      }`}
                    >
                      {STAGE_LABELS[stage.stage] ?? stage.stage}
                    </span>
                    {stage.status === "running" && (
                      <span className="inline-flex items-center gap-1 text-xs text-indigo-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Running
                      </span>
                    )}
                  </div>
                  {!compact && stage.duration !== undefined && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {stage.duration}ms
                    </p>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

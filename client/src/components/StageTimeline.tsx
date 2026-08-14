import { Check, X, Sparkles, Search, BarChart3, Shield, Brain, MessageSquare, ChevronRight } from "lucide-react";
import type { StageStepState } from "../types";

interface StageTimelineProps {
  stages: StageStepState[];
  onSelect: (stage: string) => void;
  selectedStage: string | null;
  compact?: boolean;
}

const STAGE_ICONS: Record<string, React.ReactNode> = {
  intent: <Sparkles className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
  ranking: <BarChart3 className="h-4 w-4" />,
  verification: <Shield className="h-4 w-4" />,
  ai_reasoning: <Brain className="h-4 w-4" />,
  recommendation: <MessageSquare className="h-4 w-4" />,
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
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: "text-emerald-600",
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
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
      <h3 className="text-sm font-semibold font-display text-gray-900 mb-4">
        AI Processing Stages
      </h3>

      <div className="space-y-0">
        {stages.map((stage, index) => {
          const styles = getStatusStyles(stage.status);
          const isSelected = selectedStage === stage.stage;
          const icon = STAGE_ICONS[stage.stage] ?? <Sparkles className="h-4 w-4" />;

          return (
            <div key={stage.stage}>
              <button
                onClick={() => onSelect(stage.stage)}
                className={`w-full flex items-center gap-3 rounded-lg p-2.5 text-left transition-all duration-200 ${
                  isSelected
                    ? `${styles.bg} ring-2 ring-emerald-500`
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.bg} ${styles.border} border`}
                  >
                    {stage.status === "completed" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : stage.status === "running" ? (
                      <div className="h-3 w-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    ) : stage.status === "failed" ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : (
                      <span className={styles.icon}>{icon}</span>
                    )}
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`mt-1 h-4 w-0.5 ${
                        stage.status === "completed"
                          ? "bg-green-200"
                          : stage.status === "running"
                            ? "bg-emerald-200"
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
                            ? "text-emerald-700"
                            : stage.status === "failed"
                              ? "text-red-600"
                              : "text-gray-400"
                      }`}
                    >
                      {STAGE_LABELS[stage.stage] ?? stage.stage}
                    </span>
                    {stage.status === "running" && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
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

                {isSelected && (
                  <ChevronRight className="h-4 w-4 text-emerald-500 shrink-0" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

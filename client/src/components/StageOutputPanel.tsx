import { useState } from "react";
import { Clock, AlertCircle, MessageSquare, Loader2 } from "lucide-react";
import type { StageStepState } from "../types";

interface StageOutputPanelProps {
  stages: StageStepState[];
  selectedStage: string | null;
  onSelect: (stage: string) => void;
}

const STAGE_DESCRIPTIONS: Record<string, string> = {
  intent: "Extracts structured search criteria from your natural language query.",
  search: "Searches the database for matching accommodation listings.",
  ranking: "Scores and ranks listings based on how well they match your preferences.",
  verification: "Analyzes listing quality and detects potential issues.",
  ai_reasoning: "AI analyzes listings and generates recommendations.",
  recommendation: "Builds final recommendations with explanations.",
};

function formatOutput(data: unknown): string {
  if (data === null || data === undefined) return "null";
  if (typeof data === "string") return data;
  return JSON.stringify(data, null, 2);
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

export function StageOutputPanel({
  stages,
  selectedStage,
}: StageOutputPanelProps) {
  const [viewMode, setViewMode] = useState<"output" | "raw">("output");
  const [expanded, setExpanded] = useState(false);

  const active = stages.find((s) => s.stage === selectedStage);

  if (!active) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-soft">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            Select a stage to view its output
          </p>
        </div>
      </div>
    );
  }

  const rawOutput = formatOutput(active.output);
  const isLong = rawOutput.length > 500;
  const displayOutput =
    !expanded && isLong ? truncateText(rawOutput, 500) : rawOutput;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-soft overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold font-display text-gray-900 capitalize">
              {active.stage.replace("_", " ")}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {STAGE_DESCRIPTIONS[active.stage] ?? "AI processing stage"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {active.duration !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <Clock className="h-3 w-3" />
                {active.duration}ms
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200 ${
                active.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : active.status === "running"
                    ? "bg-emerald-100 text-emerald-700"
                    : active.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-500"
              }`}
            >
              {active.status === "completed"
                ? "Completed"
                : active.status === "running"
                  ? "Running"
                  : active.status === "failed"
                    ? "Failed"
                    : "Pending"}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100">
        <div className="flex">
          {(["output", "raw"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 px-4 py-2.5 text-xs font-medium capitalize transition-all duration-200 ${
                viewMode === mode
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {mode === "raw" ? "JSON" : mode}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 max-h-96 overflow-y-auto">
        {active.status === "running" && (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
            <span className="text-sm text-emerald-600">Processing...</span>
          </div>
        )}

        {active.status === "failed" && active.error && (
          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="mt-1 text-xs text-red-600">{active.error}</p>
              </div>
            </div>
          </div>
        )}

        {active.status === "completed" && viewMode === "output" && (
          <div className="space-y-3">
            <pre className="rounded-xl bg-gray-50 p-4 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono">
              {displayOutput}
            </pre>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200"
              >
                {expanded ? "Show less" : "Show full output"}
              </button>
            )}
          </div>
        )}

        {viewMode === "raw" && (
          <pre className="rounded-xl bg-gray-900 p-4 text-xs text-green-400 overflow-x-auto whitespace-pre-wrap font-mono">
            {formatOutput({
              stage: active.stage,
              status: active.status,
              duration: active.duration,
              output: active.output,
              error: active.error,
            })}
          </pre>
        )}

        {active.status === "pending" && (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-400">Waiting to execute...</p>
          </div>
        )}
      </div>
    </div>
  );
}

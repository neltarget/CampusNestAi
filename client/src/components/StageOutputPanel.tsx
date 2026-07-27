import { useState } from "react";
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
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">
              {active.stage.replace("_", " ")}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {STAGE_DESCRIPTIONS[active.stage] ?? "AI processing stage"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {active.duration !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {active.duration}ms
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                active.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : active.status === "running"
                    ? "bg-indigo-100 text-indigo-700"
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

      <div className="border-b border-gray-200">
        <div className="flex">
          {(["output", "raw"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 px-4 py-2.5 text-xs font-medium capitalize transition-colors ${
                viewMode === mode
                  ? "border-b-2 border-indigo-500 text-indigo-600"
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
            <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm text-indigo-600">Processing...</span>
          </div>
        )}

        {active.status === "failed" && active.error && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 text-red-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="mt-1 text-xs text-red-600">{active.error}</p>
              </div>
            </div>
          </div>
        )}

        {active.status === "completed" && viewMode === "output" && (
          <div className="space-y-3">
            <pre className="rounded-lg bg-gray-50 p-4 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono">
              {displayOutput}
            </pre>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {expanded ? "Show less" : "Show full output"}
              </button>
            )}
          </div>
        )}

        {viewMode === "raw" && (
          <pre className="rounded-lg bg-gray-900 p-4 text-xs text-green-400 overflow-x-auto whitespace-pre-wrap font-mono">
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

import type { VerificationResult } from "../types";

interface VerificationSummaryProps {
  verifications: VerificationResult[];
}

export function VerificationSummary({ verifications }: VerificationSummaryProps) {
  if (verifications.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Verification Summary
        </h3>
        <p className="text-sm text-gray-500">No verification data available.</p>
      </div>
    );
  }

  const avgConfidence =
    verifications.reduce((sum, v) => sum + v.confidence, 0) / verifications.length;

  const highConfidence = verifications.filter((v) => v.confidence >= 0.8).length;
  const mediumConfidence = verifications.filter(
    (v) => v.confidence >= 0.5 && v.confidence < 0.8
  ).length;
  const lowConfidence = verifications.filter((v) => v.confidence < 0.5).length;

  const totalIssues = verifications.reduce((sum, v) => sum + v.issues.length, 0);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Verification Summary
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Average Confidence</span>
          <span
            className={`text-lg font-bold ${getConfidenceColor(avgConfidence)}`}
          >
            {Math.round(avgConfidence * 100)}%
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">High confidence</span>
            <span className="text-xs font-medium text-green-600">
              {highConfidence} listings
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Medium confidence</span>
            <span className="text-xs font-medium text-yellow-600">
              {mediumConfidence} listings
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Low confidence</span>
            <span className="text-xs font-medium text-red-600">
              {lowConfidence} listings
            </span>
          </div>
        </div>

        {totalIssues > 0 && (
          <div className="rounded-lg bg-yellow-50 p-3">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <span className="text-xs font-medium text-yellow-800">
                {totalIssues} issues detected across all listings
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {verifications.map((v) => (
            <div
              key={v.listingId}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
            >
              <span className="text-xs text-gray-600 truncate max-w-[120px]">
                Listing {v.listingId.slice(0, 8)}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      v.confidence >= 0.8
                        ? "bg-green-500"
                        : v.confidence >= 0.5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${v.confidence * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${getConfidenceColor(v.confidence)}`}
                >
                  {Math.round(v.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

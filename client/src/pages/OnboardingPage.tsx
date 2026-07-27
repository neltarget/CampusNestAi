import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function OnboardingPage() {
  const [role, setRole] = useState<"student" | "landlord" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!role) return;
    setLoading(true);
    setError("");

    const result = await updateProfile({ role });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      await refreshProfile();
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <span className="text-lg font-bold text-white">CN</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to CampusNest AI</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tell us how you&apos;ll use the platform
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/50">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6 space-y-3">
            <button
              onClick={() => setRole("student")}
              className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                role === "student"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                role === "student" ? "bg-indigo-600" : "bg-gray-100"
              }`}>
                <svg className={`h-5 w-5 ${role === "student" ? "text-white" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Student</p>
                <p className="text-sm text-gray-500">Find accommodation near your university</p>
              </div>
            </button>

            <button
              onClick={() => setRole("landlord")}
              className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                role === "landlord"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                role === "landlord" ? "bg-indigo-600" : "bg-gray-100"
              }`}>
                <svg className={`h-5 w-5 ${role === "landlord" ? "text-white" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Landlord</p>
                <p className="text-sm text-gray-500">List your properties for students</p>
              </div>
            </button>
          </div>

          <button
            onClick={handleContinue}
            disabled={!role || loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

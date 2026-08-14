import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GraduationCap, Building2, ArrowRight } from "lucide-react";

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-sm">
            <span className="text-lg font-bold text-white">CN</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Welcome to CampusNest AI
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tell us how you&apos;ll use the platform
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-elevated">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6 space-y-3">
            <button
              onClick={() => setRole("student")}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                role === "student"
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-soft"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  role === "student"
                    ? "gradient-primary"
                    : "bg-gray-100"
                }`}
              >
                <GraduationCap
                  className={`h-6 w-6 ${
                    role === "student" ? "text-white" : "text-gray-500"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Student</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Find accommodation near your university
                </p>
              </div>
            </button>

            <button
              onClick={() => setRole("landlord")}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                role === "landlord"
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-soft"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  role === "landlord"
                    ? "gradient-primary"
                    : "bg-gray-100"
                }`}
              >
                <Building2
                  className={`h-6 w-6 ${
                    role === "landlord" ? "text-white" : "text-gray-500"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Landlord</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  List your properties for students
                </p>
              </div>
            </button>
          </div>

          <button
            onClick={handleContinue}
            disabled={!role || loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
          >
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

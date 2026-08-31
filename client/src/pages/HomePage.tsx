import { useNavigate } from "react-router-dom";
import { SearchBox } from "../components/SearchBox";
import { useAuth } from "../contexts/AuthContext";
import { getTimeGreeting, getFirstName } from "../lib/auth-helpers";
import {
  MessageSquare,
  Cpu,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Zap,
  Brain,
  Database,
  BarChart3,
  CheckCircle2,
  LogIn,
} from "lucide-react";

const features = [
  {
    title: "Natural Language Search",
    description:
      "Describe what you need in plain English. No filters, no complicated forms.",
    icon: MessageSquare,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Multi-Stage AI Agent",
    description:
      "Our AI processes your request through intelligent stages for thorough matching.",
    icon: Cpu,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Verified Listings",
    description:
      "Every listing is analyzed for quality, accuracy, and reliability.",
    icon: ShieldCheck,
    color: "text-violet-600 bg-violet-50",
  },
  {
    title: "Explainable Results",
    description:
      "Understand exactly why each recommendation was made with clear reasoning.",
    icon: BookOpen,
    color: "text-amber-600 bg-amber-50",
  },
];

const pipelineSteps = [
  { name: "Your Request", icon: MessageSquare, color: "bg-emerald-500" },
  { name: "Intent Analysis", icon: Brain, color: "bg-gray-300" },
  { name: "Database Search", icon: Database, color: "bg-gray-300" },
  { name: "Ranking", icon: BarChart3, color: "bg-gray-300" },
  { name: "Verification", icon: ShieldCheck, color: "bg-gray-300" },
  { name: "AI Reasoning", icon: Zap, color: "bg-gray-300" },
  { name: "Recommendations", icon: CheckCircle2, color: "bg-emerald-500" },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleSearch = (query: string) => {
    if (!user) {
      navigate("/login", { state: { from: "/", searchQuery: query } });
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const greeting = user ? `${getTimeGreeting()}, ${getFirstName(user)}` : null;
  const displayName =
    profile?.full_name || (user ? getFirstName(user) : null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero pt-16 pb-12 sm:pt-20 sm:pb-16">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb0a_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb0a_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-40 right-1/4 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          {greeting && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">
                {greeting}
              </span>
            </div>
          )}

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-display">
            Find your perfect
            <br />
            <span className="gradient-text">student home</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {displayName
              ? `Welcome back, ${displayName.split(" ")[0]}. Describe what you need and our AI will find the best options.`
              : "Describe what you need in natural language. Our multi-stage AI agent thoroughly matches your interests with the best available accommodations."}
          </p>

          {!user && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
              <span className="text-sm text-amber-700">
                Create a free account to start searching
              </span>
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-amber-800 hover:text-amber-900"
              >
                Sign up <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="mt-6">
            <SearchBox onSearch={handleSearch} />
          </div>

          <div className="mt-5 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {[
                  "bg-emerald-500",
                  "bg-blue-500",
                  "bg-violet-500",
                  "bg-amber-500",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`h-6 w-6 rounded-full ${color} ring-2 ring-white flex items-center justify-center`}
                  >
                    <span className="text-[8px] font-bold text-white">
                      {["A", "K", "M", "J"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <span>Trusted by KNUST students</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>AI-verified listings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our AI agent processes your request through intelligent stages to
              find your ideal accommodation
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-soft hover:shadow-medium hover:border-gray-200 transition-all duration-300"
              >
                <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                  {index + 1}
                </div>
                <div
                  className={`inline-flex items-center justify-center rounded-xl p-3 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pipeline Section */}
      <section className="py-12 sm:py-16 bg-surface-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
              The Multi-Stage Agent Pipeline
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Your request flows through intelligent processing stages for
              thorough matching
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-gray-200 to-emerald-500 hidden sm:block" />

            <div className="space-y-4">
              {pipelineSteps.map((step, index) => {
                const isFirst = index === 0;
                const isLast = index === pipelineSteps.length - 1;
                const isActive = isFirst || isLast;

                return (
                  <div
                    key={step.name}
                    className="relative flex items-center gap-4 sm:gap-6"
                  >
                    <div
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div
                      className={`flex-1 rounded-xl border px-5 py-3.5 transition-all ${
                        isActive
                          ? "border-emerald-200 bg-emerald-50/50 shadow-soft"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold ${
                          isActive ? "text-emerald-700" : "text-gray-700"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <ArrowRight className="hidden sm:block h-4 w-4 text-gray-300 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Get matched in seconds, not hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <span className="text-xs font-bold text-white">CN</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                CampusNest AI
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Built for KNUST students. Powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

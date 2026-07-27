import { useNavigate } from "react-router-dom";
import { SearchBox } from "../components/SearchBox";
import { useAuth } from "../contexts/AuthContext";
import { getTimeGreeting, getFirstName } from "../lib/auth-helpers";

const features = [
  {
    title: "Natural Language Search",
    description: "Describe what you need in plain English. No filters required.",
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  },
  {
    title: "AI Orchestrator",
    description: "A single AI orchestrator reasons through your request using structured thinking.",
    icon: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
  },
  {
    title: "Verified Listings",
    description: "Every listing is analyzed for quality and reliability.",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  },
  {
    title: "Explainable Results",
    description: "Understand why each recommendation was made with clear explanations.",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const greeting = user ? `${getTimeGreeting()}, ${getFirstName(user)}` : null;
  const displayName = profile?.full_name || (user ? getFirstName(user) : null);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSIjZTBlN2ZmIi8+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-3xl text-center">
          {greeting && (
            <p className="mb-4 text-lg font-medium text-indigo-600">
              {greeting}
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {displayName
              ? <>Find your perfect<span className="text-indigo-600"> student home</span></>
              : <>Find your perfect<span className="text-indigo-600"> student home</span></>
            }
          </h1>
          <p className="mt-6 text-lg text-gray-600 sm:text-xl">
            {displayName
              ? `Welcome back, ${displayName.split(" ")[0]}. Describe what you need and our AI will find the best options.`
              : "Describe what you need in natural language. Our AI orchestrator reasons through your request to find the best accommodation."
            }
          </p>

          <div className="mt-10">
            <SearchBox onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            How it works
          </h2>
          <p className="mt-2 text-center text-gray-500">
            The AI orchestrator reasons through each step to find your ideal accommodation
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={feature.title} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <div className="absolute -left-4 -top-4 text-5xl font-bold text-indigo-50">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pipeline */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            The AI Pipeline
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Your request flows through intelligent processing stages
          </p>

          <div className="mt-10 flex flex-col items-center gap-2">
            {[
              { name: "Your Request", color: "bg-indigo-600 text-white" },
              { name: "Intent Analysis", color: "bg-white text-gray-900 border border-gray-200" },
              { name: "Database Search", color: "bg-white text-gray-900 border border-gray-200" },
              { name: "Ranking", color: "bg-white text-gray-900 border border-gray-200" },
              { name: "Verification", color: "bg-white text-gray-900 border border-gray-200" },
              { name: "AI Reasoning", color: "bg-white text-gray-900 border border-gray-200" },
              { name: "Recommendations", color: "bg-green-600 text-white" },
            ].map((step, index) => (
              <div key={step.name} className="flex flex-col items-center">
                <div
                  className={`rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm ${step.color}`}
                >
                  {step.name}
                </div>
                {index < 6 && (
                  <svg
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

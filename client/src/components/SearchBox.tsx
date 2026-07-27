import { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const exampleQueries = [
  "Quiet hostel near KNUST under GHS 4,000 with good WiFi",
  "Girls-only self-contained room close to campus with kitchen",
  "Budget shared room for two male students near KNUST",
  "Modern apartment with AC and parking under GHS 6,000",
];

export function SearchBox({
  onSearch,
  placeholder = "Describe your ideal accommodation...",
  disabled = false,
}: SearchBoxProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    if (!disabled) {
      onSearch(example);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="block w-full rounded-2xl border border-gray-200 bg-white py-4 pl-13 pr-32 text-base text-gray-900 shadow-lg shadow-gray-200/50 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Search for accommodation"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="submit"
              disabled={!query.trim() || disabled}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg
                className="h-4 w-4"
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
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400">Try:</span>
        {exampleQueries.map((example) => (
          <button
            key={example}
            onClick={() => handleExampleClick(example)}
            disabled={disabled}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {example.length > 50 ? example.slice(0, 50) + "..." : example}
          </button>
        ))}
      </div>
    </div>
  );
}

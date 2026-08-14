import { useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";

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
  const [focused, setFocused] = useState(false);

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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative rounded-2xl transition-all duration-300 ${
            focused
              ? "shadow-elevated ring-2 ring-emerald-500/20"
              : "shadow-medium"
          }`}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <Search
              className={`h-5 w-5 transition-colors duration-200 ${
                focused ? "text-emerald-500" : "text-gray-400"
              }`}
            />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className="block w-full rounded-2xl border border-gray-200 bg-white py-4 pl-13 pr-36 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            aria-label="Search for accommodation"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="submit"
              disabled={!query.trim() || disabled}
              className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Try
        </span>
        {exampleQueries.map((example) => (
          <button
            key={example}
            onClick={() => handleExampleClick(example)}
            disabled={disabled}
            className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className="max-w-[180px] truncate">
              {example.length > 45 ? example.slice(0, 45) + "..." : example}
            </span>
            <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
}

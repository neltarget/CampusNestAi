import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface SearchHistoryItem {
  id: string;
  search_query: string;
  created_at: string;
  recommendations: { length: number } | null;
}

export function SearchHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("search_history")
        .select("id, search_query, created_at, recommendations")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setHistory(
          data.map((item) => ({
            ...item,
            recommendations: item.recommendations
              ? {
                  length: Array.isArray(item.recommendations)
                    ? item.recommendations.length
                    : 0,
                }
              : null,
          }))
        );
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("id", id);

    if (!error) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display mb-2 text-2xl font-bold text-gray-900">
        Search History
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Your previous accommodation searches
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-elevated">
          <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="mb-4 text-gray-500">No searches yet</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-lg"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-elevated transition-all duration-300"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.search_query}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {formatDate(item.created_at)}
                  {item.recommendations && (
                    <span className="ml-2">
                      &middot; {item.recommendations.length} recommendation
                      {item.recommendations.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

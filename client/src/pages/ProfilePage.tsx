import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export function ProfilePage() {
  const {
    user,
    profile,
    updateProfile,
    refreshProfile,
    loading: authLoading,
  } = useAuth();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "landlord">("student");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setRole(profile.role);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const result = await updateProfile({ full_name: fullName, role });
    setSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      await refreshProfile();
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display mb-2 text-2xl font-bold text-gray-900">
        Profile
      </h1>
      <p className="mb-8 text-sm text-gray-500">Manage your account settings</p>

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-elevated">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
            {profile.full_name?.charAt(0)?.toUpperCase() ||
              profile.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {profile.full_name || "No name set"}
            </p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-gray-50/50 px-4 py-3 text-sm text-gray-600">
          <span className="font-medium">Role:</span>{" "}
          <span className="capitalize">{profile.role}</span>
          <span className="ml-3 text-gray-400">&middot;</span>
          <span className="ml-3 text-gray-400">
            Joined {new Date(profile.created_at).toLocaleDateString()}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Profile updated successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  role === "student"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("landlord")}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  role === "landlord"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Landlord
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

import type { User } from "@supabase/supabase-js";

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getFirstName(user: User): string {
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "";
  if (fullName) {
    return fullName.split(" ")[0];
  }
  return user.email?.split("@")[0] ?? "there";
}

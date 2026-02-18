import { useAuth } from "@/contexts/AuthContext";

/**
 * Returns `true` when the logged-in user has role === "committee".
 * Also exposes the full `user` object and auth helpers for convenience.
 */
export function useAdmin() {
  const { user, token, isLoading, login, logout } = useAuth();
  const isAdmin = user?.role === "committee";

  return { isAdmin, user, token, isLoading, login, logout };
}

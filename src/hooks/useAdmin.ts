import { useOptionalAuth } from "@/contexts/AuthContext";
import { isAdminHost } from "@/lib/adminHost";

/**
 * Returns `true` when the logged-in user has role === "committee".
 * When not on the admin host, returns a safe stub so public site has no auth UI.
 */
export function useAdmin() {
  const auth = useOptionalAuth();

  if (!isAdminHost() || !auth) {
    return {
      isAdmin: false,
      user: null,
      token: null,
      isLoading: false,
      login: async () => ({ user: null, token: null }),
      logout: () => {},
    } as const;
  }

  const { user, token, isLoading, login, logout } = auth;
  const isAdmin = user?.role === "committee";

  return { isAdmin, user, token, isLoading, login, logout };
}

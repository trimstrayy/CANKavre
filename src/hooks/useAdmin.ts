import { useAuth } from "@/contexts/AuthContext";

/**
 * Returns `true` when the logged-in user has role === "committee".
 * When not on the admin host, returns a safe stub so public site has no auth UI.
 */
export function useAdmin() {
  const isAdminHost = typeof window !== 'undefined' && 
    (window.location.hostname === 'admin.localhost' || window.location.hostname.startsWith('admin.'));
  if (!isAdminHost) {
    return {
      isAdmin: false,
      user: null,
      token: null,
      isLoading: false,
      login: async () => ({ user: null, token: null }),
      logout: () => {},
    } as const;
  }

  const { user, token, isLoading, login, logout } = useAuth();
  const isAdmin = user?.role === "committee";

  return { isAdmin, user, token, isLoading, login, logout };
}

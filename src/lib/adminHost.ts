export function isAdminHostname(hostname: string): boolean {
  const configuredHost = import.meta.env.VITE_ADMIN_HOSTNAME?.trim();

  if (configuredHost) {
    return hostname === configuredHost;
  }

  return hostname === 'admin.localhost' || hostname.startsWith('admin.');
}

export function isAdminHost(): boolean {
  return typeof window !== 'undefined' && isAdminHostname(window.location.hostname);
}

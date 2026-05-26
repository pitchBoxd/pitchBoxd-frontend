const API_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env
      ?.VITE_API_BASE_URL) ||
  "http://localhost:8080";

export function startGoogleLogin(): void {
  window.location.assign(`${API_BASE}/oauth2/authorization/google`);
}

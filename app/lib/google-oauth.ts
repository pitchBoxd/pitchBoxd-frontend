const GOOGLE_CLIENT_ID =
  (typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env
      ?.VITE_GOOGLE_CLIENT_ID) ||
  "499917507109-jl0co4k08fp0f6quv6r9g9inntcjaptt.apps.googleusercontent.com";

const CALLBACK_PATH = "/login/callback";
const STATE_KEY = "pitchboxd_oauth_state";

function randomState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getRedirectUri(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${CALLBACK_PATH}`;
}

export function startGoogleLogin(): void {
  const state = randomState();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state,
  });

  window.location.assign(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}

export function consumeStoredState(): string | null {
  const stored = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return stored;
}

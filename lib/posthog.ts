export async function initPostHog(): Promise<void> {
  if (typeof window === "undefined") return;
  const win = window as any;
  if (win.__POSTHOG_INITIALIZED) return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
  if (!apiKey) return;

  try {
    const mod = await import("posthog-js");
    const posthog = (mod && (mod as any).default) || mod;
    posthog.init(apiKey, { api_host: host });
    win.__POSTHOG_INITIALIZED = true;
  } catch (err) {
    // fail silently; avoid breaking the app
    // eslint-disable-next-line no-console
    console.warn("PostHog client init failed:", err);
  }
}

export async function captureEvent(event: string, props?: Record<string, any>) {
  if (typeof window === "undefined") return;
  try {
    const mod = await import("posthog-js");
    const posthog = (mod && (mod as any).default) || mod;
    if (posthog && typeof posthog.capture === "function") {
      posthog.capture(event, props);
    }
  } catch (err) {
    // ignore
  }
}

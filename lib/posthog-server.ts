import PostHog from "posthog-node";

const apiKey = process.env.POSTHOG_API_KEY || "";
const host = process.env.POSTHOG_HOST || "https://app.posthog.com";

export const posthogServer = apiKey
  ? new PostHog(apiKey, { host })
  : null;

export async function trackEvent(event: string, properties?: Record<string, any>) {
  if (!posthogServer) return;
  try {
    await posthogServer.capture({
      distinctId: properties?.distinctId || "server",
      event,
      properties,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("PostHog server track failed:", err);
  }
}

import PostHogModule from "posthog-node";

const apiKey = process.env.POSTHOG_API_KEY || "";
const host = process.env.POSTHOG_HOST || "https://app.posthog.com";

const PostHogClass: any = (PostHogModule as any).default ?? PostHogModule;

export const posthogServer: any = apiKey
  ? new PostHogClass(apiKey, { host })
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

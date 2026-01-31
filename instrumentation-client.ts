import posthog from 'posthog-js'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        // Use a recent defaults version to pick up sensible SDK defaults
        defaults: '2026-01-30',
        // Recommended for App Router to capture navigation events correctly
        capture_pageview: 'history_change',
        // Avoid injecting scripts into the body which can cause hydration warnings
        external_scripts_inject_target: 'head'
    })
}
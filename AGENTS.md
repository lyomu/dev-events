# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DevEvents is a Next.js 16 application (React 19) for discovering and managing developer events (hackathons, meetups, conferences). It uses the App Router pattern.

## Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Add shadcn/ui components
npx shadcn@latest add <component-name>
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.6 with App Router
- **UI**: Tailwind CSS v4, shadcn/ui (new-york style), Lucide icons
- **Fonts**: Schibsted Grotesk (sans), Martian Mono (mono) via next/font
- **Analytics**: PostHog (client + server)

### Path Aliases
- `@/*` maps to project root (e.g., `@/components/EventCard`)

### Key Directories
- `app/` - Next.js App Router pages and layouts
- `components/` - React components (use `"use client"` directive for client components)
- `lib/` - Utilities and service integrations

### PostHog Integration
Two initialization paths exist:
1. `components/PostHogInit.tsx` + `lib/posthog.ts` - Legacy approach using dynamic import
2. `instrumentation-client.ts` - Newer Next.js instrumentation approach

Client env: `NEXT_PUBLIC_POSTHOG_API_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
Server env: `POSTHOG_API_KEY`, `POSTHOG_HOST`

### Styling Conventions
- Global styles in `app/globals.css` with custom Tailwind utilities (`flex-center`, `text-gradient`, `glass`, `card-shadow`)
- Component-specific styles use `@layer components` with ID selectors (e.g., `#event-card`, `#explore-btn`)
- Color tokens defined as CSS custom properties in `:root`

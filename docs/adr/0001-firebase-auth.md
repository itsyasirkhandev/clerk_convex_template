# ADR 0001: Firebase Auth over alternatives

**Status**: Accepted  
**Date**: 2025-01-01

## Context

This starter template needs an authentication provider that integrates with Convex.
Options considered: Clerk, Auth.js, Firebase Auth, custom JWT.

## Decision

We chose **Firebase Auth** with Google OAuth.

## Rationale

- **Convex integration**: Firebase issues JWTs that Convex can verify via `auth.config.ts`
- **Google ecosystem**: Most developers have a Google account, making Google OAuth the lowest-friction sign-in
- **Client SDK**: Firebase Auth SDK handles token refresh, session persistence, and OAuth flow on the client
- **Free tier**: Firebase Auth is free for most use cases

## Trade-offs

- **Bundle size**: Firebase Auth SDK adds ~50KB gzipped to the client bundle
- **Vendor lock-in**: Switching auth providers requires updating both client and Convex config
- **No server-side session**: Auth state is client-managed; server actions need token forwarding

## Consequences

- `useFirebaseAuth` hook is the single source of auth state on the client
- `ConvexProviderWithAuth` wraps the app (not plain `ConvexProvider`)
- Auth config lives in `convex/auth.config.ts`

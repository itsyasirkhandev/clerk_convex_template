# ADR 0004: Authed vs Private function guard convention

**Status**: Accepted  
**Date**: 2025-01-01

## Context

Convex functions need different security models depending on who calls them.

## Decision

Two guard patterns via `convex-helpers/server/customFunctions`:

### Authed guard (`convex/authed/helpers.ts`)
- For **client-facing** functions
- Validates the Firebase JWT via `ctx.auth.getUserIdentity()`
- Injects `ctx.identity` into the handler
- Use: `authedQuery`, `authedMutation`, `authedAction`

### Private guard (`convex/private/helpers.ts`)
- For **server-to-server** functions
- Validates an API key from function arguments
- Use: `privateQuery`, `privateMutation`, `privateAction`

## Rationale

- **Single auth check**: `customCtxAndArgs` defines the identity check once, all three wrappers (query/mutation/action) share it
- **Type safety**: `ctx.identity` is typed and guaranteed non-null inside authed handlers
- **Separation of concerns**: Client-facing vs internal APIs have different security requirements

## When to use which

| Scenario | Guard |
|----------|-------|
| React hook calls (useQuery, useMutation) | `authed` |
| Server component preloading | `authed` |
| Backend-to-backend calls | `private` |
| Cron jobs | `internal` (Convex built-in) |
| Webhooks | `httpAction` |

## Demo files

- `convex/authed/demo.ts` — Minimal working example of the authed pattern
- `convex/private/demo.ts` — Minimal working example of the private pattern
- These are **AI-readable convention references**, not dead code

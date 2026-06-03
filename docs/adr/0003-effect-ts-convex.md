# ADR 0003: Effect-TS in Convex function handlers

**Status**: Accepted  
**Date**: 2025-01-01

## Context

Convex function handlers are plain async functions. We need structured logging and typed error handling.

## Decision

We use **Effect-TS** inside Convex handlers for structured logging.

## Rationale

- **Structured logging**: `Effect.logInfo(...)` provides structured, traceable log output
- **Typed errors**: `Schema.TaggedErrorClass` enables typed error channels (future use)
- **Composable**: Effect pipelines can add retry, timeout, and tracing to operations
- **Convention teaching**: Shows the Effect pattern for AI agents and developers to learn from

## Pattern

```typescript
export const myMutation = authedMutation({
  args: { value: v.number() },
  handler: async (ctx, args) => {
    // Effect for structured logging
    await Effect.runPromise(
      Effect.logInfo(`Operation for: ${ctx.identity.name}`)
    );
    // Plain await for Convex db calls
    await ctx.db.insert('table', { value: args.value });
  }
});
```

## Important constraint

- Do NOT wrap Convex `ctx.db` calls inside `Effect.gen(function*() { ... })` — the generator is not async and cannot use `await`
- Use `Effect.runPromise(Effect.logInfo(...))` for logging, keep db calls as plain `await`

## Consequences

- `effect` is a production dependency
- Every Convex function file imports `Effect` from `effect`
- The pattern is intentionally simple to serve as a teaching example

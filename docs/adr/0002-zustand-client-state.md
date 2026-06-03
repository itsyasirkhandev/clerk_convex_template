# ADR 0002: Zustand for client UI state

**Status**: Accepted  
**Date**: 2025-01-01

## Context

We need client-side state management for UI concerns (theme preference, sidebar state).
Options: React Context, Jotai, Zustand, Redux Toolkit.

## Decision

We use **Zustand** with Immer and Persist middleware.

## Rationale

- **Minimal API**: No providers needed, direct store access via hooks
- **Immer middleware**: Enables mutable-style updates for complex state
- **Persist middleware**: Theme/sidebar preferences survive page reload
- **Slice pattern**: Each concern gets its own slice file (`uiSlice.ts`), keeping the store modular
- **Selective re-renders**: Components only re-render when their selected state changes

## What belongs in Zustand vs Convex

| Zustand | Convex |
|---------|--------|
| Theme preference | User profile data |
| Sidebar open/closed | Business entities |
| Modal state | Shared/collaborative data |
| Form draft state | Anything that needs persistence across devices |

## Consequences

- Store lives in `store/index.ts` with slices in `store/slices/`
- Use `useAppStore((s) => s.field)` for selective access
- Never put server-synced data in Zustand

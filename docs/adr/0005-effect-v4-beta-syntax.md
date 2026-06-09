# 5. Effect v4 Beta Syntax and Service Migrations

Date: 2026-06-09

## Status

Accepted

## Context

The project heavily utilizes the Effect-TS ecosystem. The Effect framework is currently undergoing a massive API overhaul for version 4 (currently in beta). The rapid iteration of the v4 beta has introduced significant breaking changes, specifically regarding how dependencies (services) are defined, typed, and wired, as well as the underlying architecture of effectful types.

During recent architectural refactoring, we experienced major friction and compiler errors (`TS8`) caused by using outdated patterns from early v4 beta releases (specifically `beta.43`-era APIs) against a newer beta version (`beta.76+`). The core issues were:
1. **The Deprecation of `ServiceMap`:** The `ServiceMap.Service` API, introduced in early v4 betas as a replacement for `Context.Tag`, was entirely removed by `beta.46` in favor of a canonical `Context.Service` API.
2. **Requirement Leakage Rules:** Effect v4 introduced a strict compiler plugin/rule that explicitly blocks "Requirement Leakage". Services that require external dependencies (like `ConvexDB` in our Convex handlers) now throw compilation errors (`TS8`) unless those dependencies are explicitly satisfied at layer creation or explicitly acknowledged as leakable via the `/** @effect-leakable-service */` JSDoc tag.
3. **The `Yieldable` Trait:** In v3, structures like `Option`, `Ref`, and `Deferred` were structural subtypes of `Effect`. In v4, they are plain values implementing a `Yieldable` trait. While they can still be yielded (`yield*`) within generators, they can no longer be directly passed to Effect combinators without an explicit `.asEffect()` conversion.
4. **Unified Versioning:** The Effect ecosystem has shifted to unified versioning. All core packages (`effect`, `@effect/platform`, etc.) are now released together under a single version number to prevent the rampant version mismatch bugs that plagued v3.

## Decision

1. **Adopt Canonical v4 Syntax:** We will strictly use the `Context.Service` API for defining services, abandoning all legacy `Context.Tag`, `Context.GenericTag`, `Effect.Service`, and `ServiceMap.Service` implementations.
2. **Explicit Dependency Handling:** We will adhere strictly to Effect's new requirement leakage rules. Any service dependency intended to leak out of its layer boundary (e.g., dynamically injected request-scoped database clients like ConvexDB) must be explicitly marked with the `/** @effect-leakable-service */` JSDoc annotation.
3. **Stay Current with Beta Iterations:** We have updated the primary `effect` dependency to the latest beta (`4.0.0-beta.78`) to ensure we are developing against the most stable manifestation of the v4 API, and we will update local `.agents/skills` documentation to reflect these breaking changes to prevent AI agents from using stale v3 or early-v4-beta patterns.

## Consequences

- **Improved Stability:** Standardizing on the `Context.Service` API aligns our codebase with the final intended direction of Effect v4, eliminating the confusion caused by deprecated intermediate beta APIs.
- **Enhanced Safety:** Explicitly tracking dependency leakage provides stronger compile-time guarantees about what context is required to execute a given handler or function.
- **Migration Overhead:** We have had to systematically refactor our existing `ServiceMap` definitions, and any lingering v3 structural subtyping patterns (like passing raw `Option` types to combinators) will require explicit `.asEffect()` conversions as we migrate deeper into the codebase.

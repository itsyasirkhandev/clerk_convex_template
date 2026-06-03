// Authed convention reference — AI-readable demonstration of the canonical pattern.
//
// Pattern: Effect.gen + Effect.tryPromise for ALL async work (logging AND db calls).
// This matches the real feature files (users.ts, numbers.ts) exactly.
// See docs/adr/0003-effect-ts-convex.md for the rationale.

import { v } from 'convex/values';
import { authedQuery } from './helpers';
import { Effect, Schema } from 'effect';

// Define a domain error using Effect v4 TaggedErrorClass
export class DemoError extends Schema.TaggedErrorClass<DemoError>()("DemoError", {
	message: Schema.String
}) {}

export const authedDemoQuery = authedQuery({
	args: { count: v.number() },
	handler: async (ctx, args) => Effect.runPromise(
		Effect.gen(function* () {
			// 1. Structured logging with Effect
			yield* Effect.logInfo(`Received authed query for: ${ctx.identity.email || 'User'}`);

			// 2. Example typed domain error
			if (!ctx.identity.tokenIdentifier) {
				return yield* new DemoError({ message: "Missing token identifier" });
			}

			// 3. Convex db calls go inside Effect.tryPromise (the v4 canonical pattern)
			const numbers = yield* Effect.tryPromise(() =>
				ctx.db
					.query('numbers')
					.order('desc')
					.take(args.count)
			);

			return {
				viewer: ctx.identity.name ?? null,
				count: numbers.length,
			};
		}).pipe(
			Effect.catchTag("DemoError", (error) =>
				Effect.succeed({ viewer: null, count: 0, error: error.message })
			)
		)
	)
});


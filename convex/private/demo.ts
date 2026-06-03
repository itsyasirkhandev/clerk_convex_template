// Private convention reference — AI-readable demonstration of the server-to-server pattern.
//
// Pattern: Effect.gen + Effect.tryPromise for all async work (logging AND db calls).
// For a full example with db calls, see convex/authed/numbers.ts or convex/authed/users.ts.
// See docs/adr/0003-effect-ts-convex.md and docs/adr/0004-authed-private-convention.md.

import { v } from 'convex/values';
import { privateQuery } from './helpers';
import { Effect, Schema } from 'effect';

// Domain error for private routes using Effect v4 TaggedErrorClass
export class PrivateDemoError extends Schema.TaggedErrorClass<PrivateDemoError>()("PrivateDemoError", {
	message: Schema.String
}) {}

export const privateDemoQuery = privateQuery({
	args: {
		username: v.string()
	},
	handler: async (ctx, args) => Effect.runPromise(
		Effect.gen(function* () {
			const { username } = args;

			// 1. Structured logging with Effect
			yield* Effect.logInfo(`Private backend route accessed for: ${username}`);

			// 2. Typed domain error
			if (username === 'admin') {
				return yield* new PrivateDemoError({ message: "Admin access requires elevated privileges" });
			}

			// 3. For db calls, use Effect.tryPromise — same pattern as authed/numbers.ts
			//    yield* Effect.tryPromise(() => ctx.db.query('table').order('desc').take(10))

			return { username };
		}).pipe(
			Effect.catchTag("PrivateDemoError", (error) =>
				Effect.succeed({ error: error.message, username: null })
			)
		)
	)
});



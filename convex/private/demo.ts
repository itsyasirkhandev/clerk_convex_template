import { v } from 'convex/values';
import { privateQuery } from './helpers';
import { Effect, Schema } from 'effect';

// Example of a domain error in private routes
export class PrivateDemoError extends Schema.TaggedErrorClass<PrivateDemoError>("PrivateDemoError")(
	"PrivateDemoError",
	{ message: Schema.String }
) {}

export const privateDemoQuery = privateQuery({
	args: {
		username: v.string()
	},
	handler: async (ctx, args) => Effect.runPromise(
		Effect.gen(function* () {
			const { username } = args;

			// Effect.logInfo provides structured logging
			yield* Effect.logInfo(`Private backend route accessed for: ${username}`);

			if (username === 'admin') {
				return yield* new PrivateDemoError({ message: "Admin access requires elevated privileges" });
			}

			return { username };
		}).pipe(
			Effect.catchTag("PrivateDemoError", (error) =>
				Effect.succeed({ error: error.message, username: null })
			)
		)
	)
});

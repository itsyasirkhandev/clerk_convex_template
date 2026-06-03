import { authedQuery } from './helpers';
import { Effect, Schema } from 'effect';

// Define a domain error using v4 TaggedErrorClass
export class DemoError extends Schema.TaggedErrorClass<DemoError>("DemoError")(
	"DemoError",
	{ message: Schema.String }
) {}

export const authedDemoQuery = authedQuery({
	args: {},
	handler: async (ctx) => Effect.runPromise(
		Effect.gen(function* () {
			// Log the incoming request leveraging Effect-TS
			yield* Effect.logInfo(`Received authed query for: ${ctx.identity.email || 'User'}`);
			
			// Example of yielding a domain error conditionally
			if (!ctx.identity.tokenIdentifier) {
				return yield* new DemoError({ message: "Missing token identifier" });
			}
			
			const message = `Hello, ${ctx.identity.email || 'User'}!`;
			return { message };
		}).pipe(
			Effect.catchTag("DemoError", (error) => 
				Effect.succeed({ message: `Error handled gracefully: ${error.message}` })
			)
		)
	)
});

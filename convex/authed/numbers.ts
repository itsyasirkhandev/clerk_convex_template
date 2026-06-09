// Number generator — demo authed queries and mutations.
//
// This file shows the pattern for feature-specific Convex functions:
// 1. Import the authed helpers (authedQuery, authedMutation)
// 2. Define validators for arguments
// 3. Use ctx.identity (provided by the auth guard) instead of inline ctx.auth calls
// 4. Use Effect for structured logging

import { v } from 'convex/values';
import { authedQuery, authedMutation, runAuthedEffect } from './helpers';
import { Effect } from 'effect';
import { Numbers } from '../services/Numbers';
import { ConvexDB } from '../services/ConvexDB';

export const listNumbers = authedQuery({
	args: {
		count: v.number()
	},
	handler: async (ctx, args) => runAuthedEffect(
		Effect.gen(function* () {
			const viewerName = ctx.viewer?.name || ctx.identity.name || 'User';
			yield* Effect.logInfo(
				`Listing ${args.count} numbers for: ${viewerName}`
			);

			const numbersSvc = yield* Numbers;
			const numbers = yield* numbersSvc.listNumbers(args.count);

			return {
				viewer: viewerName,
				numbers
			};
		}).pipe(
			Effect.provideService(ConvexDB, { db: ctx.db }),
			Effect.provide(Numbers.layer)
		)
	)
});

export const addNumber = authedMutation({
	args: {
		value: v.number()
	},
	handler: async (ctx, args) => runAuthedEffect(
		Effect.gen(function* () {
			const viewerName = ctx.viewer?.name || ctx.identity.name || 'User';
			yield* Effect.logInfo(
				`Adding number ${args.value} for: ${viewerName}`
			);

			const numbersSvc = yield* Numbers;
			yield* numbersSvc.addNumber(args.value);
		}).pipe(
			Effect.provideService(ConvexDB, { db: ctx.db }),
			Effect.provide(Numbers.layer)
		)
	)
});

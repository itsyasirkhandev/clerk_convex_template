// User management — syncs Firebase auth identity to the Convex users table.
//
// This file shows the pattern for user upsert:
// 1. Look up user by tokenIdentifier (stable across token refreshes)
// 2. Create if missing, update if fields changed
// 3. Return the Convex user document

import { authedMutation, authedQuery, runAuthedEffect } from './helpers';
import { Effect } from 'effect';
import { Users } from '../services/Users';
import { ConvexDB } from '../services/ConvexDB';

export const getOrCreateUser = authedMutation({
	args: {},
	handler: async (ctx) => runAuthedEffect(
		Effect.gen(function* () {
			yield* Effect.logInfo(`getOrCreateUser for: ${ctx.identity.email || 'unknown'}`);
            
			const users = yield* Users;
			return yield* users.getOrCreateUser(ctx.identity);
		}).pipe(
			Effect.provideService(ConvexDB, { db: ctx.db }),
			Effect.provide(Users.layer)
		)
	)
});

export const currentUser = authedQuery({
	args: {},
	handler: async (ctx) => runAuthedEffect(
		Effect.gen(function* () {
			return ctx.viewer;
		})
	)
});


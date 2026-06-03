// User management — syncs Firebase auth identity to the Convex users table.
//
// This file shows the pattern for user upsert:
// 1. Look up user by tokenIdentifier (stable across token refreshes)
// 2. Create if missing, update if fields changed
// 3. Return the Convex user document

import { authedMutation, authedQuery } from './helpers';
import { Effect } from 'effect';

export const getOrCreateUser = authedMutation({
	args: {},
	handler: async (ctx) => Effect.runPromise(
		Effect.gen(function* () {
			const { identity } = ctx;
			const tokenIdentifier = identity.tokenIdentifier;

			yield* Effect.logInfo(`getOrCreateUser for: ${identity.email || 'unknown'}`);

			// Look up existing user by stable token identifier
			const existingUser = yield* Effect.tryPromise(() =>
				ctx.db
					.query('users')
					.withIndex('by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier))
					.unique()
			);

			if (existingUser) {
				// Update fields if they've changed
				const updates: Record<string, string | undefined> = {};
				if (existingUser.name !== (identity.name ?? '')) {
					updates.name = identity.name ?? '';
				}
				if (existingUser.email !== (identity.email ?? '')) {
					updates.email = identity.email ?? '';
				}
				if (existingUser.avatarUrl !== identity.pictureUrl) {
					updates.avatarUrl = identity.pictureUrl;
				}

				if (Object.keys(updates).length > 0) {
					yield* Effect.tryPromise(() => ctx.db.patch(existingUser._id, updates));
					yield* Effect.logInfo(`Updated user: ${existingUser._id}`);
				}

				return existingUser._id;
			}

			// Create new user
			const userId = yield* Effect.tryPromise(() =>
				ctx.db.insert('users', {
					name: identity.name ?? '',
					email: identity.email ?? '',
					avatarUrl: identity.pictureUrl,
					tokenIdentifier
				})
			);

			yield* Effect.logInfo(`Created new user: ${userId}`);
			return userId;
		})
	)
});

export const currentUser = authedQuery({
	args: {},
	handler: async (ctx) => Effect.runPromise(
		Effect.gen(function* () {
			const tokenIdentifier = ctx.identity.tokenIdentifier;

			const user = yield* Effect.tryPromise(() =>
				ctx.db
					.query('users')
					.withIndex('by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier))
					.unique()
			);

			return user;
		})
	)
});

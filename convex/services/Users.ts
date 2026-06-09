import { Effect, Layer, Context } from 'effect';
import { ConvexDB } from './ConvexDB';
import { UserIdentity, GenericDatabaseWriter } from 'convex/server';
import { Doc, Id, DataModel } from '../_generated/dataModel';

import { UnknownError } from 'effect/Cause';

export class Users extends Context.Service<
	Users,
	{
		readonly getOrCreateUser: (identity: UserIdentity) => Effect.Effect<Id<'users'>, UnknownError, ConvexDB>;
	}
>()('@app/Users') {
	static readonly layer = Layer.effect(
		Users,
		Effect.gen(function* () {
			const getOrCreateUser = Effect.fn('Users.getOrCreateUser')(function* (
				identity: UserIdentity
			) {
				const { db } = yield* ConvexDB;
				const writerDb = db as GenericDatabaseWriter<DataModel>;
				const tokenIdentifier = identity.tokenIdentifier;

				let viewer = yield* Effect.tryPromise(() =>
					writerDb
						.query('users')
						.withIndex('by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier))
						.unique()
				);

				if (viewer) {
					const updates: Record<string, string | undefined> = {};
					if (viewer.name !== (identity.name ?? '')) {
						updates.name = identity.name ?? '';
					}
					if (viewer.email !== (identity.email ?? '')) {
						updates.email = identity.email ?? '';
					}
					if (viewer.avatarUrl !== identity.pictureUrl) {
						updates.avatarUrl = identity.pictureUrl;
					}

					if (Object.keys(updates).length > 0) {
						yield* Effect.tryPromise(() => writerDb.patch(viewer!._id, updates));
						viewer = (yield* Effect.tryPromise(() => writerDb.get(viewer!._id)))!;
					}
				} else {
					const userId = yield* Effect.tryPromise(() =>
						writerDb.insert('users', {
							name: identity.name ?? '',
							email: identity.email ?? '',
							avatarUrl: identity.pictureUrl,
							tokenIdentifier
						})
					);
					viewer = (yield* Effect.tryPromise(() => writerDb.get(userId)))!;
				}

				return viewer._id;
			});

			return { getOrCreateUser };
		})
	);
}

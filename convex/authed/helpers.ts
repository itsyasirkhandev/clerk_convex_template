// "authed" queries/mutations/actions are ones that get called from the client,
// protected by the auth token (Firebase in this project).
//
// The authGuard uses customCtxAndArgs to define the identity check once.
// This mirrors the pattern in private/helpers.ts (apiKeyGuard).

import {
	customAction,
	customCtxAndArgs,
	customMutation,
	customQuery
} from 'convex-helpers/server/customFunctions';
import { action, mutation, query } from '../_generated/server';

const authGuard = customCtxAndArgs({
	args: {},
	input: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error('Unauthorized');
		}

		return { ctx: { ...ctx, identity }, args: {} };
	}
});

export const authedQuery = customQuery(query, authGuard);
export const authedMutation = customMutation(mutation, authGuard);
export const authedAction = customAction(action, authGuard);


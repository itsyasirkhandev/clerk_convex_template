// Public queries — no auth required.
//
// Use for:
// - Server component preloading (no JWT available server-side)
// - Public-facing data (landing pages, shared views)
//
// For mutations or user-specific data, use authed functions instead.

import { v } from 'convex/values';
import { query } from '../_generated/server';

export const listNumbers = query({
	args: {
		count: v.number()
	},
	handler: async (ctx, args) => {
		const numbers = await ctx.db
			.query('numbers')
			.order('desc')
			.take(args.count);

		return {
			viewer: null,
			numbers: numbers.reverse().map((n) => n.value)
		};
	}
});

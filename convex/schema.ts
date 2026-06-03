import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		name: v.string(),
		email: v.string(),
		avatarUrl: v.optional(v.string()),
		tokenIdentifier: v.string()
	}).index('by_token', ['tokenIdentifier']),

	numbers: defineTable({
		value: v.number()
	})
});

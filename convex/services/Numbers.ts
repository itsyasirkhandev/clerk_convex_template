import { Effect, Layer, Context } from 'effect';
import { ConvexDB } from './ConvexDB';
import { GenericDatabaseWriter } from 'convex/server';
import { DataModel } from '../_generated/dataModel';

import { UnknownError } from 'effect/Cause';

export class Numbers extends Context.Service<
	Numbers,
	{
		readonly listNumbers: (count: number) => Effect.Effect<number[], UnknownError, ConvexDB>;
		readonly addNumber: (value: number) => Effect.Effect<void, UnknownError, ConvexDB>;
	}
>()('@app/Numbers') {
	static readonly layer = Layer.effect(
		Numbers,
		Effect.gen(function* () {
			const listNumbers = Effect.fn('Numbers.listNumbers')(function* (count: number) {
				const { db } = yield* ConvexDB;
				const numbers = yield* Effect.tryPromise(() =>
					db
						.query('numbers')
						.order('desc')
						.take(count)
				);
				return numbers.reverse().map((n) => n.value);
			});

			const addNumber = Effect.fn('Numbers.addNumber')(function* (value: number) {
				const { db } = yield* ConvexDB;
				const writerDb = db as GenericDatabaseWriter<DataModel>;
				yield* Effect.tryPromise(() => writerDb.insert('numbers', { value }));
			});

			return { listNumbers, addNumber };
		})
	);
}

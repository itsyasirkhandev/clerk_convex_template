import { Context } from 'effect';
import { GenericDatabaseReader, GenericDatabaseWriter } from 'convex/server';
import { DataModel } from '../_generated/dataModel';

/** @effect-leakable-service */
export class ConvexDB extends Context.Service<
	ConvexDB,
	{ db: GenericDatabaseReader<DataModel> | GenericDatabaseWriter<DataModel> }
>()('ConvexDB') {}

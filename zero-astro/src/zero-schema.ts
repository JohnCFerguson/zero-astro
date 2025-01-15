// NOTE:
// You need your db to exist that matches this schema.
// I  don't have migration code in this repo, feel free to add

import { createSchema, createTableSchema } from '@rocicorp/zero';

const todoSchema = createTableSchema({
	tableName: 'todo',
	columns: {
		id: { type: 'string' },
		title: { type: 'string' },
		completed: { type: 'boolean' }
	},
	primaryKey: ['id'],
	relationships: {}
});

const userSchema = createTableSchema({
	tableName: 'user',
	columns: {
		id: { type: 'number' },
		name: { type: 'string' },
		email: { type: 'string' }
	},
	primaryKey: ['id']
});

export const schema = createSchema({
	version: 1,
	tables: {
		todo: todoSchema,
		user: userSchema
	}
});

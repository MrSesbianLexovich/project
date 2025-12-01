import * as pg from 'drizzle-orm/pg-core'


export const users = pg.pgTable('users', {
	id: pg
		.varchar({ length: 255 })
		.notNull()
		.primaryKey()
		.$default(() => Bun.randomUUIDv7()),
	name: pg
		.text()
		.notNull(),
	email: pg
		.text()
		.notNull()
		.unique()
	// dob: pg
	// 	.timestamp()
		
})



export const products = pg.pgTable('products', {
	id: pg
		.varchar({length:255})
		.notNull()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	imageUrl: pg
		.text('url'),
	name: pg
		.text('name')
		.notNull(),
	description: pg
		.text('description')
		.notNull()
})


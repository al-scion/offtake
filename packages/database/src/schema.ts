import { index, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
	"users_table",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: varchar().notNull(),
		age: integer().notNull(),
		email: varchar().notNull().unique(),
	},
	(table) => [index("by_name").on(table.name)]
);

export const schema = {
	usersTable,
};

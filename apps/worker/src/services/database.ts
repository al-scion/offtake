import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable(
	"users",
	{
		id: integer().primaryKey(),
		name: text().notNull(),
		email: text().notNull(),
	},
	(table) => [index("by_name").on(table.name)]
);

export const companies = sqliteTable("companies", {
	id: integer().primaryKey(),
	name: text().notNull(),
});

export const schema = {
	usersTable,
	companies,
};

import { defineSchema } from "convex/server";
import { kvTables } from "./kv/schema";
import { storageTables } from "./storage/schema";
import { workspaceTables } from "./workspace/schema";

export default defineSchema({
	...kvTables,
	...workspaceTables,
	...storageTables,
});

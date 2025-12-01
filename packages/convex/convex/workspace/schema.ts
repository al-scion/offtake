import { defineTable } from "convex/server";
import { v } from "convex/values";

const workspace = defineTable({
	name: v.string(),
	namespace: v.string(),
	type: v.optional(v.union(v.literal("private"), v.literal("public"))),
}).index("by_namespace", ["namespace"]);

export const workspaceTables = {
	workspace,
};

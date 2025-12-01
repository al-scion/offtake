import { v } from "convex/values";
import { mutation, query } from "../../convex/_generated/server";
import { workspaceTables } from "./schema";

export const createWorkspace = mutation({
	args: workspaceTables.workspace.validator,
	handler: async (ctx, args) => {
		return await ctx.db.insert("workspace", args);
	},
});

export const getWorkspaces = query({
	args: {
		namespace: v.string(),
	},
	handler: async (ctx, args) => {
		const workspaces = await ctx.db
			.query("workspace")
			.withIndex("by_namespace", (q) => q.eq("namespace", args.namespace))
			.collect();

		return workspaces;
	},
});

export const getWorkspace = query({
	args: {
		workspaceid: v.id("workspace"),
	},
	handler: async (ctx, args) => {
		const workspace = await ctx.db.get(args.workspaceid);
		return workspace;
	},
});

import { Experimental_Agent as Agent, tool } from "ai";
import { z } from "zod";
import { registry } from "./models";

const saveTool = tool({
	name: "save-tool",
	inputSchema: z.object({}),
	execute: async (args) => {},
});

const agent = new Agent({
	model: registry.languageModel("google/gemini-2.5-flash"),
	tools: {},
});

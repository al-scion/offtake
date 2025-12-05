import { Agent, convertToModelMessages, generateText, ToolLoopAgent } from "ai";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";

export const agentRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

agentRouter.post("/image", describeRoute({}), validator("json", z.object({ prompt: z.string() })), async (c) => {
	const registry = c.var.registry;
	const { prompt } = c.req.valid("json");

	const response = await generateText({
		model: registry.languageModel("google/gemini-3-pro-image-preview"),
		prompt,
	});
	const { mediaType, uint8Array } = response.files[0]!;

	return c.body(new Uint8Array(uint8Array), 200, { "Content-Type": mediaType });
});

agentRouter.post(
	"/text",
	describeRoute({}),
	validator("json", z.object({ id: z.string(), messages: z.array(z.any()) })),
	async (c) => {
		const registry = c.var.registry;
		const { id, messages } = c.req.valid("json");

		const modelMessages = convertToModelMessages(messages);

		const response = await generateText({
			model: registry.languageModel("google/gemini-3-pro-preview"),
			messages: modelMessages,
		});

		return c.json(response.text);
	}
);

agentRouter.post(
	"/stream",
	describeRoute({}),
	validator("json", z.object({ id: z.string(), messages: z.array(z.any()) })),
	async (c) => {
		const registry = c.var.registry;
		const { id, messages } = c.req.valid("json");

		const modelMessages = convertToModelMessages(messages);

		const response = await generateText({
			model: registry.languageModel("google/gemini-3-pro-preview"),
			messages: modelMessages,
		});

		return c.json(response.text);
	}
);

agentRouter.post("/agent", describeRoute({}), validator("json", z.object({ prompt: z.string() })), async (c) => {
	const registry = c.var.registry;
	const agent = new ToolLoopAgent({
		model: registry.languageModel("google/gemini-flash-latest"),
		instructions: "You are a helpful assistant that can answer questions and help with tasks.",
		tools: {},
	});

	const response = agent.stream({ prompt: "Hello, how are you?" });
});

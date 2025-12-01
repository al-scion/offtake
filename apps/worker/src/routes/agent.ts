import { generateText } from "ai";
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

agentRouter.post("/text", describeRoute({}), validator("json", z.object({ prompt: z.string() })), async (c) => {
	const registry = c.var.registry;
	const { prompt } = c.req.valid("json");

	const response = await generateText({
		model: registry.languageModel("google/gemini-3-pro-preview"),
		prompt,
	});

	return c.json(response.text);
});

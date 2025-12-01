import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";

export const storageRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

storageRouter.put("/upload", describeRoute({}), validator("form", z.object({ file: z.file() })), async (c) => {
	const { file } = c.req.valid("form");
	const key = crypto.randomUUID();
	await c.env.STORAGE.put(key, file, { httpMetadata: { contentType: file.type }, customMetadata: { name: file.name } });
	return c.json({ key });
});

storageRouter.get("/serve", describeRoute({}), validator("query", z.object({ key: z.string() })), async (c) => {
	const { key } = c.req.valid("query");
	const file = await c.env.STORAGE.get(key, {});
	if (!file) {
		return c.notFound();
	}
	return c.body(file.body, 200, { "content-type": file.httpMetadata?.contentType ?? "" });
});

storageRouter.get("/list", describeRoute({}), async (c) => {
	const files = await c.env.STORAGE.list({ include: ["customMetadata", "httpMetadata"] });
	return c.json(files);
});

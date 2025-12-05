import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";

export const storageRouter = new Hono<{ Bindings: Env; Variables: Variables }>()
	.put("/upload", describeRoute({}), validator("form", z.object({ file: z.file() })), async (c) => {
		const { file } = c.req.valid("form");
		const key = crypto.randomUUID();
		await c.env.STORAGE.put(key, file, {
			httpMetadata: { contentType: file.type },
			customMetadata: { name: file.name },
		});

		// const convex = c.var.convex;
		// const convexApi = c.var.convexApi;
		// await convex.mutation(convexApi.storage.functions.createFile, {
		// 	key,
		// 	mimeType: file.type,
		// 	name: file.name,
		// 	size: file.size,
		// });

		return c.json({ key });
	})

	.get("/serve", describeRoute({}), validator("query", z.object({ key: z.string() })), async (c) => {
		const { key } = c.req.valid("query");
		const file = await c.env.STORAGE.get(key, {});
		if (!file) {
			return c.notFound();
		}
		return c.body(file.body, 200, { "content-type": file.httpMetadata?.contentType ?? "" });
	});

storageRouter.get(
	"/list",
	describeRoute({}),
	validator("query", z.object({ prefix: z.string().optional() })),
	async (c) => {
		const { prefix } = c.req.valid("query");
		const files = await c.env.STORAGE.list({
			include: ["customMetadata", "httpMetadata"],
			prefix,
		});
		return c.json(files);
	}
);

storageRouter.get("/fuse", describeRoute({}), async (c) => {
	const tokens = await c.var.cloudflare.r2.temporaryCredentials.create({
		account_id: c.env.CLOUDFLARE_ACCOUNT_ID,
		bucket: c.env.CLOUDFLARE_R2_BUCKET_NAME,
		permission: "object-read-write",
		ttlSeconds: 60 * 60,
		prefixes: ["fuse"],
		parentAccessKeyId: c.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
	});

	return c.json(tokens);
});

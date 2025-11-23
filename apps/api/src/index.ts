import { Scalar } from "@scalar/hono-api-reference";
import { s3, serve } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { describeRoute, openAPIRouteHandler, validator } from "hono-openapi";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "./env";

const app = new Hono()
	.use(logger())
	.use(serveStatic({ root: "./public" }))
	.use(cors())

	.get("/token", describeRoute({}), async (c) => {
		const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
		const session = await openai.realtime.clientSecrets.create({ session: { type: "realtime" } });
		return c.json(session);
	})

	.put("/upload", describeRoute({}), validator("form", z.object({ file: z.file() })), async (c) => {
		const { file } = c.req.valid("form");
		const key = crypto.randomUUID();
		await s3.write(key, file);
		return c.json({ key });
	});

app.get("/openapi", openAPIRouteHandler(app));
app.get("/", Scalar({ url: "/openapi", hideClientButton: true, favicon: "./favicon.svg" }));

export type AppType = typeof app;

export const server = serve({
	port: env.PORT,
	fetch: app.fetch,
});

console.log(`Server is running on ${server.url}`);

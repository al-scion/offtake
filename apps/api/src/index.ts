import { serve, s3 } from "bun";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { env } from "./env";
import { Scalar } from "@scalar/hono-api-reference";
import { z } from "zod";
import { describeRoute, openAPIRouteHandler, validator } from "hono-openapi";

const app = new Hono();
app.use("*", logger());
app.use("*", serveStatic({ root: "./public" }));
app.use("*", cors());


app.put("/upload", 
	describeRoute({}), 
	validator('form', z.object({file: z.file()})), 
	async (c) => {
		const { file } = c.req.valid('form');
		const key = crypto.randomUUID();
		await s3.write(key, file)
		return c.json({ key });
	}
);

app.get("/openapi", openAPIRouteHandler(app));
app.get("/", Scalar({ url: "/openapi", hideClientButton: true, favicon: "./favicon.svg" }));

export type AppType = typeof app;

export const server = serve({
	port: env.PORT,
	fetch: app.fetch,
});

console.log(`Server is running on ${server.url}`);
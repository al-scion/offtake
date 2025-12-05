import { Container } from "@cloudflare/containers";
import { api } from "@packages/convex";
import { Scalar } from "@scalar/hono-api-reference";
import { Redis } from "@upstash/redis/cloudflare";
import { WorkOS } from "@workos-inc/node";
import Cloudflare from "cloudflare";
import { ConvexClient } from "convex/browser";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { drizzle as drizzleHyperdrive } from "drizzle-orm/postgres-js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwk } from "hono/jwk";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { describeRoute, openAPIRouteHandler, validator } from "hono-openapi";
import postgres from "postgres";
import { z } from "zod";

import { routers } from "./routes";
import { cronHandler } from "./services/cron";
import { schema } from "./services/database";
import { discord } from "./services/discord";
import { emailHandler } from "./services/email";
import { mcpHandler } from "./services/mcp";
import { registry } from "./services/models";
import { queueHandler } from "./services/queue";
import { tailHandler } from "./services/tail";
import { getFileHash } from "./utils";

export { Sandbox } from "@cloudflare/sandbox";
export { Workflow } from "./services/workflow";

declare global {
	type Variables = {
		redis: Redis;
		convex: ConvexClient;
		convexApi: typeof api;
		database: DrizzleD1Database<typeof schema>;
		schema: typeof schema;
		cloudflare: Cloudflare;
		registry: typeof registry;
		workos: WorkOS;
	};
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()
	.use(logger())
	.use(cors())
	.use(prettyJSON())
	.use(async (c, next) => {
		const redis = Redis.fromEnv(c.env, {});
		const convex = new ConvexClient(c.env.CONVEX_URL, {});
		const database = drizzle(c.env.DB, { schema });
		const workos = new WorkOS(c.env.WORKOS_API_KEY);

		const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5, fetch_types: false });
		const hyperdrive = drizzleHyperdrive(sql, { schema: undefined });

		const cloudflare = new Cloudflare({ apiToken: c.env.CLOUDFLARE_API_AUTH_TOKEN });

		c.set("redis", redis);
		c.set("convex", convex);
		c.set("convexApi", api);
		c.set("database", database);
		c.set("schema", schema);
		c.set("registry", registry);
		c.set("workos", workos);
		c.set("cloudflare", cloudflare);

		await next();
	})
	// .use("/protected/*", jwk({ jwks_uri: `https://api.workos.com/sso/jwks/${process.env.WORKOS_CLIENT_ID}` }));
	.route("/api", routers);

app.mount("/discord", (req, env, ctx) => discord.fetch(req, env, ctx));
app.all("/mcp", (c) => mcpHandler(c.req.raw));
app.get("/openapi", openAPIRouteHandler(app));
app.get("/", Scalar({ url: "/openapi", hideClientButton: true }));

export type WorkerType = typeof app;
export default (<ExportedHandler<Env>>{
	fetch: app.fetch,
	scheduled: cronHandler,
	queue: queueHandler,
	tail: tailHandler,
	email: emailHandler,
});

import { Scalar } from "@scalar/hono-api-reference";
import { WorkOS } from "@workos-inc/node";
import { s3, serve } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { jwk } from "hono/jwk";
import { logger } from "hono/logger";
import type { JWTPayload } from "hono/utils/jwt/types";
import { describeRoute, openAPIRouteHandler, validator } from "hono-openapi";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "./env";

type Variables = {
	jwtPayload: JWTPayload & { sub: string };
};

const app = new Hono<{ Variables: Variables }>()
	.use(logger())
	.use(serveStatic({ root: "./public" }))
	.use(cors())
	.use("/protected/*", jwk({ jwks_uri: `https://api.workos.com/sso/jwks/${env.WORKOS_CLIENT_ID}` }))

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
	})

	.get("/protected/auth", describeRoute({}), async (c) => {
		// const payload = c.get("jwtPayload");
		const payload = c.var.jwtPayload;
		console.log(payload);
		return c.json({ payload });
	})

	.post("/create-organization", describeRoute({}), validator("json", z.object({ orgName: z.string() })), async (c) => {
		const workos = new WorkOS(env.WORKOS_API_KEY);
		const { orgName } = c.req.valid("json");
		const { sub: userId } = c.get("jwtPayload");

		// Create organization
		const org = await workos.organizations.createOrganization({ name: orgName });

		// Add user to organization
		const membership = await workos.userManagement.createOrganizationMembership({
			userId,
			organizationId: org.id,
		});
	});

app.get("/openapi", openAPIRouteHandler(app));
app.get("/", Scalar({ url: "/openapi", hideClientButton: true, favicon: "./favicon.svg" }));

export type AppType = typeof app;

export const server = serve({
	port: env.PORT,
	fetch: app.fetch,
});

console.log(`Server is running on ${server.url}`);

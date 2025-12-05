import { getSandbox, proxyToSandbox, type Sandbox } from "@cloudflare/sandbox";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";

export const sandboxRouter = new Hono<{ Bindings: Env; Variables: Variables }>().get(
	"/:sandboxId",
	describeRoute({}),
	validator("query", z.object({ prompt: z.string() })),
	async (c) => {
		const { sandboxId } = c.req.param();
		const { prompt } = c.req.query();
		const sandbox = getSandbox(c.env.SANDBOX, sandboxId, {});

		await sandbox.setEnvVars({
			ANTHROPIC_API_KEY: c.env.ANTHROPIC_API_KEY,
		});

		// const tokens = await c.var.cloudflare.r2.temporaryCredentials.create({
		// 	account_id: c.env.CLOUDFLARE_ACCOUNT_ID,
		// 	bucket: c.env.CLOUDFLARE_R2_BUCKET_NAME,
		// 	permission: "object-read-write",
		// 	ttlSeconds: 60 * 60,
		// 	parentAccessKeyId: c.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
		// 	prefixes: [sandboxId],
		// });
		// const bucketEndpoint = `https://${c.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
		// await sandbox.mountBucket(c.env.CLOUDFLARE_R2_BUCKET_NAME, "/data", {
		// 	endpoint: bucketEndpoint,
		// 	credentials: {
		// 		accessKeyId: c.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
		// 		secretAccessKey: tokens.secretAccessKey!,
		// 	},
		// });

		await sandbox.startAndWaitForPorts();

		const response = await sandbox.exec(`cd /app && claude -p ${prompt}`);

		return c.json(response);
	}
);

import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import Stripe from "stripe";

export const webhookRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

webhookRouter.post("/stripe", describeRoute({}), async (c) => {
	const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
	const payload = await c.req.json();
	const signature = c.req.header("Stripe-Signature");

	if (!signature) {
		return c.json({ error: "Missing signature" }, 401);
	}

	const event = stripe.webhooks.constructEvent(payload, signature, c.env.STRIPE_WEBHOOK_SECRET);

	console.log(event);
	// TODO: Handle the processing of the event

	return c.json({ success: true });
});

// app.post("/discord", async (c) => {
// 	const payload = await c.req.json();
// 	const signature = c.req.header("x-signature-ed25519");
// 	const discordAppId = c.env.DISCORD_APP_ID;
// 	const publicKey = c.env.DISCORD_PUBLIC_KEY;
// 	const discordBotToken = c.env.DISCORD_BOT_TOKEN;

// 	return c.json({ success: true });
// });

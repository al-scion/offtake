import { Hono } from "hono";
import { agentRouter } from "./agent";
import { chRouter } from "./ch";
import { chatRouter } from "./chat";
import { sandboxRouter } from "./sandbox";
import { storageRouter } from "./storage";
import { webhookRouter } from "./webhooks";

export const routers = new Hono()
	.route("/webhooks", webhookRouter)
	.route("/companies-house", chRouter)
	.route("/storage", storageRouter)
	.route("/agent", agentRouter)
	.route("/chat", chatRouter)
	.route("/sandbox", sandboxRouter);

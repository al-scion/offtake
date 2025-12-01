import { Hono } from "hono";
import { agentRouter } from "./agent";
import { chRouter } from "./ch";
import { storageRouter } from "./storage";
import { webhookRouter } from "./webhooks";

export const routers = new Hono();
routers.route("/webhooks", webhookRouter);
routers.route("/companies-house", chRouter);
routers.route("/storage", storageRouter);
routers.route("/agent", agentRouter);

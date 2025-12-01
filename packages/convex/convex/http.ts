import { httpRouter } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors";
import { httpAction } from "./_generated/server";

const http = httpRouter();
const app = corsRouter(http, {});

app.route({
	path: "/",
	method: "GET",
	handler: httpAction(async () => {
		return new Response("ok");
	}),
});

export default app.http;

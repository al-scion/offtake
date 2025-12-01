import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get(
	"/",
	describeRoute({}),
	validator(
		"query",
		z.object({
			query: z.string(),
		})
	),
	async (c) => {
		const { query } = c.req.valid("query");

		const apiKey = Buffer.from(`${c.env.COMPANIES_HOUSE_API_KEY}:`).toString("base64");

		// Build query params from the validated input
		const queryParams = new URLSearchParams();
		queryParams.set("company_name_includes", query);

		const headers = new Headers();
		headers.set("Authorization", `Basic ${apiKey}`);

		const response = await fetch(
			`https://api.company-information.service.gov.uk/advanced-search/companies?${queryParams.toString()}`,
			{ headers }
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Companies House API error:", response.status, response.statusText, errorText);
			return c.json({ error: "Failed to fetch companies", status: response.status, details: errorText }, 500);
		}

		const data = await response.json();
		return c.json(data);
	}
);

export { app as chRouter };

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { OrganizationMembership } from "@workos-inc/node";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/dashboard"!</div>;
}

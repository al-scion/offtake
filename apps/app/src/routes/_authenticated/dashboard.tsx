import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useApi } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const api = useApi();

	const { data } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => api.protected.auth.$get(),
	});

	return <div>Hello "/_authenticated/dashboard"!</div>;
}

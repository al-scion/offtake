import { createFileRoute, useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/trade")({
	component: RouteComponent,
});

function RouteComponent() {
	const { auth } = useRouteContext({ from: "/_authenticated/trade" });

	return <div>Hello "/_authenticated/trade/"! {JSON.stringify(auth)}</div>;
}

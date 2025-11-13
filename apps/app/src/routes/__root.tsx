// import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, useRouterState } from "@tanstack/react-router";
// import type { ConvexReactClient } from "convex/react";
import { Providers } from "@/components/providers";
import "../index.css";
import { useAuth } from "@workos-inc/authkit-react";

export interface RouterContext {
	queryClient: QueryClient;
	// auth: ReturnType<typeof useAuth>;
	// convexReactClient: ConvexReactClient;
	// convexQueryClient: ConvexQueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	head: (ctx) => ({
		meta: [],
		links: [
			{
				rel: "icon",
				href: "/favicon.svg",
			},
		],
	}),
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Providers>
				<Outlet />
			</Providers>
		</>
	);
}

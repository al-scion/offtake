import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { Authenticated, AuthLoading, Unauthenticated, useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getApiClient } from "@/lib/api";

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		const url = location.href;
		if (!context.auth.user) {
			context.auth.signIn({ state: { location: location.href } });
		}

		if (!context.auth.organizationId) {
			console.log("No organization id found");
			// throw redirect({ to: "/onboarding" });
		}

		context.queryClient.prefetchQuery({
			queryKey: ["organizations"],
			queryFn: async () => {
				const accessToken = await context.auth.getAccessToken();
				const client = getApiClient(accessToken);
				const res = await client.protected.organizations.$get();
				return await res.json();
			},
			staleTime: 1000 * 60 * 5,
		});

		// const queryClient = context.queryClient;
		// queryClient.fetchQuery({
		// 	queryKey: ["organizations"],
		// 	queryFn: async () => {

		// 	},
		// })

		// if (!context.organizationMemberships) {
		// 	context.auth.getAccessToken().then(async (accessToken) => {
		// 		const client = apiClient(accessToken);
		// 		const res = await client.protected.organizations.$get();
		// 		const data = await res.json();
		// 		console.log(data);
		// 		context.organizationMemberships = data;
		// 	});
		// }

		// context.organizationMemberships = orgList;
	},
});

function RouteComponent() {
	const { user, organizationId } = useAuth();

	if (!user) {
		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<Loader2 className="animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
			<AppSidebar />
			<div className="flex flex-1 flex-col">
				<header className="flex h-12 flex-row items-center border-b p-3">
					{user?.id} {organizationId}
				</header>
				<div className="flex flex-col">
					<Outlet />
				</div>
			</div>
			<CommandMenu />
		</SidebarProvider>
	);
}

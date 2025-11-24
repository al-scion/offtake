import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.auth.user) {
			// TODO: Add the current state of the url so we return to it after auth...
			await context.auth.signIn({ state: {} });
		}
	},
});

function RouteComponent() {
	const { user } = useAuth();

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
			<div className="flex w-full flex-col">
				<header className="flex h-12 flex-row items-center border-b p-3">{user?.id}</header>
				<Outlet />
			</div>
			<CommandMenu />
		</SidebarProvider>
	);
}

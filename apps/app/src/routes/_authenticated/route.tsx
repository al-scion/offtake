import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.auth.user) {
			await context.auth.signIn();
		}
	},
});

function RouteComponent() {
	const { signIn, user, isLoading } = useAuth();

	return (
		<SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
			<AppSidebar />
			<div className="flex w-full flex-col">
				<header className="flex h-12 flex-row items-center border-b p-3">
					{/* <div onClick={() => auth.signOut()}>Sign out</div> */}
					{user?.id}
				</header>
				<Outlet />
			</div>
			<CommandMenu />
		</SidebarProvider>
	);
}

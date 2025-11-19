import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import {
	Building,
	Building2,
	ChevronsLeft,
	ChevronsUpDown,
	Home,
	LogOut,
	PanelLeft,
	Search,
	Settings,
	SidebarClose,
	SidebarOpen,
	Unplug,
	User,
	Webhook,
} from "lucide-react";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "./ui/menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "./ui/sidebar";

const sidebarItems = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: Home,
	},
	{
		label: "Integrations",
		href: "/integrations",
		icon: Unplug,
	},
	{
		label: "Webhooks",
		href: "/webhooks",
		icon: Webhook,
	},
];

export function AppSidebar() {
	const urlPrefix = "";
	const { toggleSidebar, state } = useSidebar();
	const auth = useAuth();
	const location = useLocation();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="h-12 border-b">
				<SidebarMenu>
					<SidebarMenuItem className="flex flex-row gap-1">
						<Menu>
							<MenuTrigger
								render={(props, menuState) => (
									<SidebarMenuButton className="w-fit" isActive={menuState.open} {...props}>
										<Building2 />
										<span className="truncate">Org name Org name Org name</span>
										<ChevronsUpDown className="-ml-1 size-3" />
									</SidebarMenuButton>
								)}
							/>
							<MenuPopup align="start" className="min-w-52">
								<MenuItem>
									<Settings />
									Settings
								</MenuItem>
								<MenuSeparator />
								<MenuItem onClick={() => auth.signOut()}>
									<LogOut />
									Log out
								</MenuItem>
							</MenuPopup>
						</Menu>
						<TooltipButton
							className={cn("ml-auto hover:bg-sidebar-accent", state === "collapsed" && "hidden")}
							tooltip="Collapse sidebar"
							variant="ghost"
						>
							<PanelLeft />
						</TooltipButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton onClick={() => useAppState.setState({ commandMenuOpen: true })} tooltip="Search">
									<Search />
									Search
								</SidebarMenuButton>
							</SidebarMenuItem>
							{sidebarItems.map((item) => {
								const url = `${urlPrefix}${item.href}`;
								return (
									<SidebarMenuItem key={url}>
										<Link tabIndex={-1} to={url}>
											<SidebarMenuButton isActive={location.pathname === url} tooltip={item.label}>
												<item.icon />
												<span>{item.label}</span>
											</SidebarMenuButton>
										</Link>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}

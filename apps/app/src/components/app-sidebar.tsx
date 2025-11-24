import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import {
	Building,
	Building2,
	ChevronRight,
	ChevronsLeft,
	ChevronsUpDown,
	CircleChevronRight,
	Home,
	Loader2,
	LogOut,
	type LucideIcon,
	PanelLeft,
	Plus,
	Search,
	Settings,
	SidebarClose,
	SidebarOpen,
	Unplug,
	User,
	Webhook,
} from "lucide-react";
import React from "react";
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

type FolderProps = {
	label: string;
	items: { label: string; href: string; icon: LucideIcon }[];
	actionHandler?: () => void;
	actionTooltip?: string;
	isActionLoading?: boolean;
	isLoading?: boolean;
};

function Folder(props: FolderProps) {
	const { label, items, actionHandler, actionTooltip, isLoading, isActionLoading } = props;
	const [isOpen, setIsOpen] = React.useState(true);
	const { state } = useSidebar();
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarMenu className="mb-px">
				<SidebarMenuItem className="group/sidebar-item relative">
					<SidebarMenuButton
						className="text-foreground/70 hover:text-foreground/70 active:text-foreground/70"
						onClick={() => setIsOpen(!isOpen)}
						tooltip={`${isOpen ? "Hide" : "Show"} ${label.charAt(0).toLowerCase() + label.slice(1)}`}
					>
						<CircleChevronRight
							className={cn(
								"text-foreground transition-transform duration-200",
								isOpen && "rotate-90",
								state === "expanded" && "hidden"
							)}
						/>
						<span className={cn("truncate font-medium text-xs", state === "collapsed" && "hidden")}>{label}</span>
						<ChevronRight
							className={cn(
								"-ml-1.5 size-3 stroke-[2.4px] transition-transform duration-200",
								isOpen && "rotate-90",
								state === "collapsed" && "hidden"
							)}
						/>
					</SidebarMenuButton>
					{actionHandler && (
						<TooltipButton
							className={cn(
								"-translate-y-1/2 absolute top-1/2 right-1 size-6 rounded-sm transition-none hover:bg-sidebar-accent",
								"opacity-0 focus-visible:opacity-100 group-hover/sidebar-item:opacity-100",
								isActionLoading && "opacity-100",
								state === "collapsed" && "hidden"
							)}
							onClick={actionHandler}
							size="icon"
							tooltip={actionTooltip}
							variant="ghost"
						>
							{isActionLoading ? <Loader2 className="animate-spin" /> : <Plus />}
						</TooltipButton>
					)}
				</SidebarMenuItem>
			</SidebarMenu>
			<SidebarGroupContent
				className={cn(
					"grid transition-all duration-200",
					isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] overflow-hidden opacity-0"
				)}
			>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.href}>
							<Link tabIndex={-1} to={item.href}>
								<SidebarMenuButton isActive={location.pathname.includes(item.href)} tooltip={item.label}>
									<item.icon />
									<span>{item.label}</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

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
										<span className="truncate">Org name</span>
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
						{/* <TooltipButton
							className={cn("ml-auto hover:bg-sidebar-accent", state === "collapsed" && "hidden")}
							tooltip="Collapse sidebar"
							variant="ghost"
						>
							<PanelLeft />
						</TooltipButton> */}
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

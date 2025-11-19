import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "./ui/toast";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="root">
			<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
				<TooltipProvider delay={200}>
					<ToastProvider position="top-right">{children}</ToastProvider>
				</TooltipProvider>
			</ThemeProvider>
		</div>
	);
};

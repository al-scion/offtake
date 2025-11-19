import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	children?: React.ReactNode;
	tooltip?: string;
	shortcutKeys?: string[];
	isLoading?: boolean;
}

export function TooltipButton({
	children,
	tooltip,
	className,
	isLoading = false,
	shortcutKeys,
	...props
}: TooltipButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button className={cn(className)} isLoading={isLoading} {...props}>
						{children}
					</Button>
				}
			/>
			{tooltip && (
				<TooltipContent>
					<span>{tooltip}</span>
					{shortcutKeys && shortcutKeys.length > 0 && (
						<KbdGroup className="-mr-[3px]">
							{shortcutKeys.map((key, index) => (
								<Kbd key={index}>{key}</Kbd>
							))}
						</KbdGroup>
					)}
				</TooltipContent>
			)}
		</Tooltip>
	);
}

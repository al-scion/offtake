import { CopyMinus, FilePlus, Upload } from "lucide-react";
import { useRef } from "react";
import { useApi, useUploadFile } from "@/lib/api";
import { useGetFilesByNamespace } from "@/lib/convex";
import { TooltipButton } from "./tooltip-button";

export function FileTree({ workspaceId }: { workspaceId: string }) {
	const api = useApi();

	const { data: files } = useGetFilesByNamespace(workspaceId);

	const uploadFile = useUploadFile();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ?? [];
	};

	return (
		<div className="flex h-full w-64 flex-col border-r">
			<div className="flex flex-row items-center p-2">
				<span className="font-medium text-muted-foreground text-xs">Files</span>
				<div className="ml-auto flex">
					<TooltipButton onClick={() => fileInputRef.current?.click()} size="icon" variant="ghost">
						<Upload />
						<input className="hidden" multiple onChange={(e) => {}} ref={fileInputRef} type="file" />
					</TooltipButton>
					<TooltipButton size="icon" variant="ghost">
						<CopyMinus />
					</TooltipButton>
				</div>
			</div>
			<div>{JSON.stringify(files)}</div>
		</div>
	);
}

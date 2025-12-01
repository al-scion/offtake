import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@packages/convex";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetKv = (key: string) => {
	const isValid = key !== "";
	return useQuery({
		...convexQuery(api.kv.functions.getKV, isValid ? { key } : "skip"),
	});
};

export const useSetKv = () => {
	return useMutation({
		mutationFn: useConvexMutation(api.kv.functions.setKV).withOptimisticUpdate((localStore, args) => {
			localStore.setQuery(api.kv.functions.getKV, { key: args.key }, args.value);
		}),
	});
};

export const useCreateWorkspace = () => {
	return useMutation({
		mutationFn: useConvexMutation(api.workspace.functions.createWorkspace),
	});
};

export const useGetWorkspaces = (namespace: string | undefined) => {
	// export const useGetWorkspaces = (namespace: string | undefined) => {
	const isInvalid = namespace === undefined || namespace === "";

	return useQuery({
		...convexQuery(api.workspace.functions.getWorkspaces, isInvalid ? "skip" : { namespace }),
	});
};

export const useGetFilesByNamespace = (namespace: string) => {
	return useQuery({
		...convexQuery(api.storage.functions.getFilesByNamespace, { namespace }),
	});
};

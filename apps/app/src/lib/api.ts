import type { AppType } from "@apps/api/src/index";
import type { WorkerType } from "@apps/worker/src/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@workos-inc/authkit-react";
import { hc } from "hono/client";
import { env } from "./env";

export const useApi = () => {
	const { getAccessToken } = useAuth();

	const worker = hc<WorkerType>(env.VITE_WORKER_URL, {
		headers: async () => ({
			Authorization: `Bearer ${await getAccessToken()}`,
		}),
	});

	const server = hc<AppType>(env.VITE_SERVER_URL, {
		headers: async () => ({
			Authorization: `Bearer ${await getAccessToken()}`,
		}),
	});

	return { worker, server };
};

export const getApiClient = (token: string) => {
	return hc<AppType>(env.VITE_SERVER_URL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const useUploadFile = () => {
	const api = useApi();

	return useMutation({
		mutationFn: async (file: File) => {
			const response = await api.worker.api.storage.upload.$put({
				form: { file },
			});
			const data = await response.json();
			return data;
		},
	});
};

export const useGetOrganizations = () => {
	const api = useApi();
	return useQuery({
		queryKey: ["organizations"],
		queryFn: async () => {
			const response = await api.server.protected.organizations.$get();
			const data = await response.json();
			return data;
		},
	});
};

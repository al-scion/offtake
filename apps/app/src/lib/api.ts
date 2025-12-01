import type { AppType } from "@apps/api/src/index";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@workos-inc/authkit-react";
import { hc } from "hono/client";
import { env } from "./env";

export const useApi = () => {
	const { getAccessToken } = useAuth();

	return hc<AppType>(env.VITE_SERVER_URL, {
		headers: async () => ({
			Authorization: `Bearer ${await getAccessToken()}`,
		}),
	});
};

export const getApiClient = (token: string) => {
	return hc<AppType>(env.VITE_SERVER_URL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const useGetOrganizations = () => {
	const api = useApi();
	return useQuery({
		queryKey: ["organizations"],
		queryFn: async () => {
			const response = await api.protected.organizations.$get();
			const data = await response.json();
			return data;
		},
	});
};

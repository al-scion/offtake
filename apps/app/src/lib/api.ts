import type { AppType } from "@apps/api/src/index";
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

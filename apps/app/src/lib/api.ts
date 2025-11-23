import type { AppType } from "@apps/api/src/index";
import { hc } from "hono/client";
import { env } from "./env";

export const api = hc<AppType>(env.VITE_SERVER_URL);

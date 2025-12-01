import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import vite from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		tailwindcss(),
		tanstackRouter({ autoCodeSplitting: true, target: "react" }),
		vite({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		devtools(),
		cloudflare(),
		devtoolsJson(),
		tsConfigPaths(),
	],
});

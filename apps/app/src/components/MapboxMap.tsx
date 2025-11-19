import { Map as MapboxGLMap } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/lib/env";

export function MapboxMap() {
	return (
		<MapboxGLMap
			initialViewState={{
				longitude: -74.5,
				latitude: 40,
				zoom: 9,
			}}
			mapboxAccessToken={env.VITE_MAPBOX_TOKEN}
			mapStyle="mapbox://styles/mapbox/streets-v12"
			style={{ width: "100%", height: "100%" }}
		/>
	);
}

import Map from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { env } from '@/lib/env'

export function MapboxMap() {
  return (
    <Map
      mapboxAccessToken={env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -74.5,
        latitude: 40,
        zoom: 9
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    />
  )
}

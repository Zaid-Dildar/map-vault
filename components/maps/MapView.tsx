"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { SavedPlace } from "../../lib/types";

interface MapViewProps {
  places: SavedPlace[];
  className?: string;
}

export default function MapView({ places, className = "" }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
      center: [-74.5, 40],
      zoom: 9,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || !places.length) return;

    // Add markers for each place
    places.forEach((place) => {
      new maplibregl.Marker()
        .setLngLat(place.coordinates)
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<h3>${place.name}</h3><p>${place.address}</p>`
          )
        )
        .addTo(map.current!);
    });

    // Fit map to show all places
    if (places.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      places.forEach((place) => bounds.extend(place.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [places, mapLoaded]);

  return (
    <div ref={mapContainer} className={`w-full h-96 rounded-lg ${className}`} />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Place } from "../../lib/types";

interface MapViewProps {
  places: Place[];
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

    // Clean old markers before adding new ones
    document.querySelectorAll(".maplibregl-marker").forEach((m) => m.remove());

    places.forEach((place) => {
      const coords: LngLatLike = [place.lng, place.lat];

      new maplibregl.Marker()
        .setLngLat(coords)
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<h3>${place.name}</h3>
             ${place.address ? `<p>${place.address}</p>` : ""}
             ${
               place.url
                 ? `<a href="${place.url}" target="_blank">View on Maps</a>`
                 : ""
             }`
          )
        )
        .addTo(map.current!);
    });

    // Fit bounds if multiple places
    if (places.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      places.forEach((place) => bounds.extend([place.lng, place.lat]));
      map.current.fitBounds(bounds, { padding: 50 });
    } else if (places.length === 1) {
      map.current.setCenter([places[0].lng, places[0].lat]);
      map.current.setZoom(14);
    }
  }, [places, mapLoaded]);

  return (
    <div ref={mapContainer} className={`w-full h-96 rounded-lg ${className}`} />
  );
}

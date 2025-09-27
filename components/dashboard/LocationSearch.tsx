"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { Search, Loader2 } from "lucide-react";

interface LocationSearchProps {
  onPlaceAdded: (place: Place) => void;
}

// Type for a MapTiler geocoding feature
interface GeocodingFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

interface GeocodingResponse {
  features: GeocodingFeature[];
}

export default function LocationSearch({ onPlaceAdded }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingFeature[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const resp = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          query
        )}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
      );
      const data: GeocodingResponse = await resp.json();
      setResults(data.features || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (feature: GeocodingFeature) => {
    const place: Place = {
      name: feature.text || "Unnamed Place",
      address: feature.place_name || undefined,
      lat: feature.center[1],
      lng: feature.center[0],
      url: `https://www.google.com/maps?q=${feature.center[1]},${feature.center[0]}`,
    };
    onPlaceAdded(place);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a location..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </form>

      {results.length > 0 && (
        <ul className="divide-y border rounded">
          {results.map((r) => (
            <li
              key={r.id}
              className="p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAdd(r)}
            >
              <p className="text-sm font-medium">{r.text}</p>
              <p className="text-xs text-gray-500">{r.place_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { NextResponse } from "next/server";
import { GeoJsonFeatureCollection, Place, ScrapedPlace } from "@/lib/types";

type FileType = "takeout" | "scraper" | "unknown";

function extractCoordinatesFromGoogleMapsUrl(
  url: string
): { lat: number; lng: number } | null {
  if (!url) return null;
  try {
    let m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };

    m = url.match(/!4d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
    if (m) return { lat: parseFloat(m[2]), lng: parseFloat(m[1]) };

    const latMatch = url.match(/!3d(-?\d+\.\d+)/);
    const lngMatch = url.match(/!4d(-?\d+\.\d+)/);
    if (latMatch && lngMatch) {
      return {
        lat: parseFloat(latMatch[1]),
        lng: parseFloat(lngMatch[1]),
      };
    }

    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+),/);
    if (atMatch) {
      return {
        lat: parseFloat(atMatch[1]),
        lng: parseFloat(atMatch[2]),
      };
    }

    const coordPairs = url.match(/(-?\d+\.\d+),(-?\d+\.\d+)/g);
    if (coordPairs) {
      for (const pair of coordPairs) {
        const [latStr, lngStr] = pair.split(",");
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (
          !isNaN(lat) &&
          !isNaN(lng) &&
          Math.abs(lat) <= 90 &&
          Math.abs(lng) <= 180
        ) {
          return { lat, lng };
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

async function expandGoogleShortUrl(
  shortUrl: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(shortUrl, { method: "GET" });
    const finalUrl = res.url || shortUrl;
    return extractCoordinatesFromGoogleMapsUrl(finalUrl);
  } catch {
    return null;
  }
}

async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  if (!address) return null;
  const apiKey =
    process.env.MAPTILER_API_KEY || process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  if (!apiKey) return null;

  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(
    address
  )}.json?key=${apiKey}&limit=1`;
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data: {
    features?: { center: [number, number] }[];
  } = await response.json();

  if (data.features?.length) {
    const [lng, lat] = data.features[0].center;
    return { lat, lng };
  }
  return null;
}

function areValidCoordinates(lat: number, lng: number): boolean {
  return (
    isFinite(lat) &&
    isFinite(lng) &&
    lat !== 0 &&
    lng !== 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function detectFileType(data: unknown): FileType {
  if (typeof data !== "object" || data === null) return "unknown";

  // Takeout
  if ("type" in data && "features" in data) {
    const fc = data as Partial<GeoJsonFeatureCollection>;
    if (fc.type === "FeatureCollection" && Array.isArray(fc.features)) {
      return "takeout";
    }
  }

  // Scraper
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (
      first &&
      typeof first === "object" &&
      "name" in first &&
      "url" in first
    ) {
      return "scraper";
    }
  }

  return "unknown";
}

function processTakeoutData(json: GeoJsonFeatureCollection): Place[] {
  return json.features.map((f) => {
    const coords = f.geometry?.coordinates ?? [0, 0];
    const [lng, lat] = coords;
    const props = f.properties ?? {};
    return {
      name: props.location?.name ?? "Unnamed place",
      address: props.location?.address,
      lat,
      lng,
      url: props.google_maps_url,
      date: props.date,
    };
  });
}

async function processScrapedData(places: ScrapedPlace[]): Promise<Place[]> {
  return Promise.all(
    places.map(async (place): Promise<Place> => {
      let lat = NaN;
      let lng = NaN;

      if (place.url) {
        const coords = extractCoordinatesFromGoogleMapsUrl(place.url);
        if (coords && areValidCoordinates(coords.lat, coords.lng)) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      if (!areValidCoordinates(lat, lng) && place.url) {
        if (/maps\.app\.goo\.gl|goo\.gl|maps\.app|shorturl/.test(place.url)) {
          const expanded = await expandGoogleShortUrl(place.url);
          if (expanded && areValidCoordinates(expanded.lat, expanded.lng)) {
            lat = expanded.lat;
            lng = expanded.lng;
          }
        }
      }

      if (!areValidCoordinates(lat, lng) && place.address) {
        const g = await geocodeAddress(place.address);
        if (g && areValidCoordinates(g.lat, g.lng)) {
          lat = g.lat;
          lng = g.lng;
        }
      }

      if (!areValidCoordinates(lat, lng)) {
        const fallbackQuery = place.address
          ? `${place.name}, ${place.address}`
          : place.name;
        if (fallbackQuery) {
          const g = await geocodeAddress(fallbackQuery);
          if (g && areValidCoordinates(g.lat, g.lng)) {
            lat = g.lat;
            lng = g.lng;
          }
        }
      }

      if (!areValidCoordinates(lat, lng)) {
        lat = 0;
        lng = 0;
      }

      return {
        name: place.name,
        address: place.address,
        lat,
        lng,
        url: place.url,
        date: new Date().toISOString(),
      };
    })
  );
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON file" }, { status: 400 });
    }

    const fileType = detectFileType(json);
    if (fileType === "unknown") {
      return NextResponse.json(
        {
          error:
            "Invalid file format. Expected either Google Takeout GeoJSON or scraped places JSON.",
        },
        { status: 400 }
      );
    }

    let places: Place[];
    if (fileType === "takeout") {
      places = processTakeoutData(json as GeoJsonFeatureCollection);
    } else {
      places = await processScrapedData(json as ScrapedPlace[]);
    }

    const validPlaces = places.filter((p) => areValidCoordinates(p.lat, p.lng));
    const invalidPlaces = places.filter(
      (p) => !areValidCoordinates(p.lat, p.lng)
    );

    return NextResponse.json({
      places: validPlaces,
      total: places.length,
      valid: validPlaces.length,
      invalid: invalidPlaces.length,
      invalidPlaces: invalidPlaces.map((p) => p.name),
      source: fileType,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to parse file" },
      { status: 500 }
    );
  }
}

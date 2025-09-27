import { NextResponse } from "next/server";
import { Place } from "@/lib/types";

interface GeoJsonFeatureCollection {
  type: string;
  features: GeoJsonFeature[];
}

interface GeoJsonFeature {
  type: string;
  geometry?: {
    type: string;
    coordinates?: [number, number];
  };
  properties?: {
    date?: string;
    google_maps_url?: string;
    location?: {
      name?: string;
      address?: string;
    };
    [key: string]: unknown;
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();

    let json: GeoJsonFeatureCollection;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON file" }, { status: 400 });
    }

    if (
      !json ||
      json.type !== "FeatureCollection" ||
      !Array.isArray(json.features)
    ) {
      return NextResponse.json(
        { error: "Invalid file format: expected FeatureCollection" },
        { status: 400 }
      );
    }

    const places: Place[] = json.features.map((f) => {
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

    return NextResponse.json(places);
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to parse file" },
      { status: 500 }
    );
  }
}

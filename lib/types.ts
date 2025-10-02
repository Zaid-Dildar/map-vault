export interface Place {
  name: string;
  address?: string;
  lat: number;
  lng: number;
  url?: string;
  date?: string;
}

// Google Takeout Feature
export interface GoogleTakeoutFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    date?: string;
    google_maps_url?: string;
    location?: {
      name?: string;
      address?: string;
    };
  };
}

// Custom place JSON
export interface CustomPlaceJSON {
  name: string;
  address?: string;
  lat: number;
  lng: number;
  url?: string;
  date?: string;
}

// File root formats
export type FileRoot =
  | { features: GoogleTakeoutFeature[] }
  | CustomPlaceJSON[]
  | { places: CustomPlaceJSON[] };

export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export interface GeoJsonFeature {
  type: "Feature";
  geometry?: {
    type: "Point";
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

export interface ScrapedPlace {
  name: string;
  url: string;
  address?: string;
}

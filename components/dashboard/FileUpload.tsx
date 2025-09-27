"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { CustomPlaceJSON, GoogleTakeoutFeature, Place } from "@/lib/types";

function isGoogleTakeout(
  data: unknown
): data is { features: GoogleTakeoutFeature[] } {
  return (
    typeof data === "object" &&
    data !== null &&
    "features" in data &&
    Array.isArray((data as { features?: unknown }).features)
  );
}

function isCustomArray(data: unknown): data is CustomPlaceJSON[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "lat" in item &&
        "lng" in item &&
        "name" in item
    )
  );
}

function isPlacesObject(data: unknown): data is { places: CustomPlaceJSON[] } {
  return (
    typeof data === "object" &&
    data !== null &&
    "places" in data &&
    Array.isArray((data as { places?: unknown }).places)
  );
}

interface FileUploadProps {
  onPlacesLoaded: (places: Place[]) => void;
}

export default function FileUpload({ onPlacesLoaded }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const text = await file.text();
        const data: unknown = JSON.parse(text);

        let places: Place[] = [];

        if (isGoogleTakeout(data)) {
          places = data.features
            .filter(
              (f) =>
                Array.isArray(f.geometry?.coordinates) &&
                !!f.properties?.location?.name
            )
            .map((f) => ({
              name: f.properties.location?.name ?? "Unnamed Place",
              address: f.properties.location?.address ?? undefined,
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
              url: f.properties.google_maps_url ?? undefined,
              date: f.properties.date ?? undefined,
            }));
        } else if (isCustomArray(data)) {
          places = data
            .filter(
              (item) =>
                typeof item.lat === "number" &&
                typeof item.lng === "number" &&
                !!item.name
            )
            .map((item) => ({
              name: item.name,
              address: item.address ?? undefined,
              lat: item.lat,
              lng: item.lng,
              url: item.url ?? undefined,
              date: item.date ?? undefined,
            }));
        } else if (isPlacesObject(data)) {
          places = data.places
            .filter(
              (item) =>
                typeof item.lat === "number" &&
                typeof item.lng === "number" &&
                !!item.name
            )
            .map((item) => ({
              name: item.name,
              address: item.address ?? undefined,
              lat: item.lat,
              lng: item.lng,
              url: item.url ?? undefined,
              date: item.date ?? undefined,
            }));
        }

        if (places.length === 0) {
          throw new Error(
            "No valid places found in the file. Please check the file format."
          );
        }

        setSuccess(
          `Successfully loaded ${places.length} place${
            places.length !== 1 ? "s" : ""
          }!`
        );
        onPlacesLoaded(places);
      } catch (err) {
        console.error("File processing error:", err);
        if (err instanceof SyntaxError) {
          setError(
            "Invalid JSON file. Please make sure you're uploading a valid JSON file from Google Takeout."
          );
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to process file"
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [onPlacesLoaded]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        await processFile(file);
      }
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/json": [".json"],
        "text/plain": [".txt"],
      },
      maxFiles: 1,
      multiple: false,
    });

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
          ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : isDragReject
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
          ${loading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-gray-600">Processing your file...</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              {isDragActive ? (
                <p className="text-sm text-blue-600">Drop your file here...</p>
              ) : isDragReject ? (
                <p className="text-sm text-red-600">
                  Only JSON files are supported
                </p>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: Google Takeout Saved Places JSON
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <p className="font-medium">Upload failed</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-700">
            <p className="font-medium">Upload successful</p>
            <p className="mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* File Format Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Supported File Formats
        </h4>
        <div className="text-xs text-blue-800 space-y-2">
          <div>
            <p className="font-medium">Google Takeout (Recommended):</p>
            <p>
              Upload the <code>Saved Places.json</code> file from your Google
              Maps takeout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Place } from "@/lib/types";
import MapView from "./MapView";
import PlacesList from "./PlacesList";
import LocationSearch from "./LocationSearch";
import FileUpload from "./FileUpload";
import ExportButton from "./ExportButton";
import { Upload, Map, List, Search } from "lucide-react";

interface PlaceManagerProps {
  initialPlaces?: Place[];
}

export default function PlaceManager({
  initialPlaces = [],
}: PlaceManagerProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [activeTab, setActiveTab] = useState<"upload" | "search" | "list">(
    "upload"
  );

  const handlePlacesLoaded = useCallback((newPlaces: Place[]) => {
    setPlaces(newPlaces);
    setActiveTab("list");
  }, []);

  const handlePlaceAdded = useCallback((newPlace: Place) => {
    setPlaces((prev) => [...prev, newPlace]);
    setActiveTab("list");
  }, []);

  const handlePlaceRemoved = useCallback((placeToRemove: Place) => {
    setPlaces((prev) =>
      prev.filter(
        (place) =>
          !(
            place.lat === placeToRemove.lat &&
            place.lng === placeToRemove.lng &&
            place.name === placeToRemove.name
          )
      )
    );
  }, []);

  const handlePlaceUpdated = useCallback(
    (updatedPlace: Place, originalPlace: Place) => {
      setPlaces((prev) =>
        prev.map((place) =>
          place.lat === originalPlace.lat &&
          place.lng === originalPlace.lng &&
          place.name === originalPlace.name
            ? updatedPlace
            : place
        )
      );
    },
    []
  );

  const clearAllPlaces = useCallback(() => {
    if (
      places.length > 0 &&
      confirm("Are you sure you want to clear all places?")
    ) {
      setPlaces([]);
    }
  }, [places.length]);

  return (
    <div className="space-y-8">
      {/* Always visible map */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Map className="w-5 h-5 mr-2" />
                Your Places Map
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {places.length === 0
                  ? "Upload a file or search for places to see them on the map"
                  : `Showing ${places.length} place${
                      places.length !== 1 ? "s" : ""
                    }`}
              </p>
            </div>
            {places.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {places.length} place{places.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearAllPlaces}
                  className="text-xs px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <MapView places={places} className="h-[400px]" />
        </div>
      </div>

      {/* Tabbed interface for different actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "upload"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Upload className="w-4 h-4 mr-2 inline" />
              Upload File
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "search"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Search className="w-4 h-4 mr-2 inline" />
              Add Places
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <List className="w-4 h-4 mr-2 inline" />
              Manage List ({places.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "upload" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Google Takeout File
              </h3>
              <FileUpload onPlacesLoaded={handlePlacesLoaded} />
            </div>
          )}

          {activeTab === "search" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Search and Add Places
              </h3>
              <LocationSearch onPlaceAdded={handlePlaceAdded} />
            </div>
          )}

          {activeTab === "list" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Manage Your Places
                </h3>
                {places.length > 0 && <ExportButton places={places} />}
              </div>
              <PlacesList
                places={places}
                onPlaceRemoved={handlePlaceRemoved}
                onPlaceUpdated={handlePlaceUpdated}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

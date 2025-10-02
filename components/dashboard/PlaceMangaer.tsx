"use client";

import { useState, useCallback } from "react";
import { Place } from "@/lib/types";
import MapView from "./MapView";
import PlacesList from "./PlacesList";
import LocationSearch from "./LocationSearch";
import FileUpload from "./FileUpload";
import ExportButton from "./ExportButton";

import { Upload, Map, List, Search, Rocket } from "lucide-react";
import QuickImportModal from "./QuickImportModal";

interface PlaceManagerProps {
  initialPlaces?: Place[];
}

export default function PlaceManager({
  initialPlaces = [],
}: PlaceManagerProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"upload" | "search" | "list">(
    "upload"
  );

  const handlePlacesLoaded = useCallback((newPlaces: Place[]) => {
    console.log(newPlaces);
    setPlaces(newPlaces);
    setActiveTab("list");
  }, []);

  const handlePlaceAdded = useCallback((newPlace: Place) => {
    console.log(newPlace);
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
        <div className="px-4 py-4 sm:px-6 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                <span className="hidden md:inline text-sm text-gray-500">
                  {places.length} place{places.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearAllPlaces}
                  className="text-xs px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
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
          <nav className="flex space-x-4 md:space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "upload"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-center md:inline">
                <Upload className="w-4 h-4 mx-auto md:mr-2 md:inline md:-mt-1" />
              </div>
              Upload File
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "search"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-center md:inline">
                <Search className="w-4 h-4 mx-auto md:mr-2 md:inline md:-mt-1" />
              </div>
              Add Places
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-center md:inline">
                <List className="w-4 h-4 mx-auto md:mr-2 md:inline md:-mt-1" />
              </div>
              Manage List ({places.length})
            </button>
            {/* Button to get saved places automatically from google maps */}
            <button
              onClick={() => setIsModalOpen((prev) => !prev)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                isModalOpen
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-center md:inline">
                <Rocket className="w-4 h-4 mx-auto md:mr-2 md:inline md:-mt-1" />
              </div>
              Quick Import{" "}
              <span className="hidden md:inline">From Google Maps</span>
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
              <div className="flex-col sm:flex-row items-center justify-between mb-8">
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  Manage Your Places
                </h3>
                {places.length > 0 && (
                  <ExportButton places={places} variant="inline" />
                )}
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
      <QuickImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handlePlacesLoaded}
      />
    </div>
  );
}

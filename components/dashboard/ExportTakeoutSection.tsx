"use client";

import { useState } from "react";
import UploadTakeout from "@/components/dashboard/UploadTakeout";
import MapView from "@/components/dashboard/MapView";
import ExportButton from "@/components/dashboard/ExportButton";
import { Place } from "@/lib/types";

export default function UploadTakeoutSection() {
  const [places, setPlaces] = useState<Place[]>([]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Import Your Google Maps Takeout JSON
        </h2>
        <UploadTakeout onData={setPlaces} />
      </div>

      {places.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Saved Places
            </h2>
            <MapView places={places} />
          </div>

          <ExportButton places={places} />
        </div>
      )}
    </>
  );
}

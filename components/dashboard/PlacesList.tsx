"use client";

import { Place } from "@/lib/types";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

interface PlacesListProps {
  places: Place[];
  onPlaceRemoved: (place: Place) => void;
  onPlaceUpdated: (updated: Place, original: Place) => void;
}

export default function PlacesList({
  places,
  onPlaceRemoved,
  onPlaceUpdated,
}: PlacesListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Place | null>(null);

  const startEditing = (place: Place, index: number) => {
    setEditingIndex(index);
    setDraft({ ...place });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setDraft(null);
  };

  const saveEditing = (original: Place) => {
    if (draft) {
      onPlaceUpdated(draft, original);
      cancelEditing();
    }
  };

  return (
    <div className="space-y-3">
      {places.length === 0 && (
        <p className="text-sm text-gray-500">
          No places yet — upload or search to add some.
        </p>
      )}

      {places.map((place, idx) => (
        <div
          key={`${place.lat}-${place.lng}-${idx}`}
          className="flex items-start justify-between border rounded-lg p-3 bg-gray-50 hover:bg-gray-100"
        >
          {editingIndex === idx && draft ? (
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Place name"
              />
              <input
                type="text"
                value={draft.address ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, address: e.target.value || undefined })
                }
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Address (optional)"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEditing(place)}
                  className="text-green-600 hover:text-green-700 flex items-center text-sm"
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {place.name}
              </h4>
              {place.address && (
                <p className="text-xs text-gray-600">{place.address}</p>
              )}
              <p className="text-xs text-gray-400">
                {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
              </p>
              {place.url && (
                <a
                  href={place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View on Maps
                </a>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 ml-3">
            {editingIndex === idx ? null : (
              <>
                <button
                  onClick={() => startEditing(place, idx)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onPlaceRemoved(place)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

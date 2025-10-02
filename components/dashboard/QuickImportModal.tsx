import { useState } from "react";
import { X, AlertCircle, Loader2, Upload } from "lucide-react";
import { Place } from "@/lib/types";
import BookmarkletGenerator from "./BookmarkletGenerator";

interface QuickImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newPlaces: Place[]) => void;
}

export default function QuickImportModal({
  isOpen,
  onClose,
  onImport,
}: QuickImportModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [pastedData, setPastedData] = useState("");

  const handleUploadScrapedData = async () => {
    setError("");

    if (!pastedData.trim()) {
      setError("Please paste the scraped data in the text area above");
      return;
    }

    setIsProcessing(true);
    setUploadProgress("Processing data...");

    try {
      // Validate JSON
      let parsedData;
      try {
        parsedData = JSON.parse(pastedData);
      } catch {
        throw new Error(
          "Invalid JSON format. Please copy the data exactly as shown by the scraper."
        );
      }

      if (!Array.isArray(parsedData)) {
        throw new Error("Data should be an array of places");
      }

      // Create a JSON file from pasted data
      const blob = new Blob([pastedData], { type: "application/json" });
      const file = new File([blob], "scraped-places.json", {
        type: "application/json",
      });

      // Upload to API for enrichment
      setUploadProgress("Enriching with coordinates...");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();

      setUploadProgress("Complete!");

      // Show results to user
      if (result.invalid > 0) {
        alert(
          `Imported ${result.valid} places successfully!\n\n` +
            `${result.invalid} places could not be located:\n` +
            result.invalidPlaces.slice(0, 5).join("\n") +
            (result.invalidPlaces.length > 5
              ? `\n...and ${result.invalidPlaces.length - 5} more`
              : "")
        );
      } else {
        alert(`Successfully imported ${result.valid} places!`);
      }

      // Call parent's import handler with the enriched places
      onImport(result.places);
      setPastedData("");
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to process scraped data"
      );
    } finally {
      setIsProcessing(false);
      setUploadProgress("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            Quick Import from Google Maps
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bookmarklet Generator */}
          <BookmarkletGenerator />

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                After running the bookmarklet
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Final steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>
                After the scraper finishes, click the &quot;Copy Scraped
                Data&quot; button that appears
              </li>
              <li>Come back here and paste the data in the text area below</li>
              <li>
                Click &quot;Import Places&quot; to process and add them to your
                map
              </li>
            </ol>
          </div>

          {/* Paste Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Scraped Data Here
            </label>
            <textarea
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
              placeholder={
                'Paste the JSON data here...\n\nIt should look like:\n[\n  {\n    "name": "Place Name",\n    "url": "https://maps.app.goo.gl/...",\n    "address": "123 Street"\n  }\n]'
              }
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
            />
            <p className="text-xs text-gray-500 mt-1">
              {pastedData.trim()
                ? `${pastedData.split("\n").length} lines pasted`
                : "Waiting for data..."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-red-600 flex-shrink-0 mt-0.5"
              />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Upload Button */}
          <div className="border-t pt-6">
            <button
              onClick={handleUploadScrapedData}
              disabled={isProcessing || !pastedData.trim()}
              className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {uploadProgress || "Processing..."}
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Import Places
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This will enrich your data with coordinates and import all places
            </p>
          </div>

          {/* How it works */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
              What happens when you click Import:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Validates the JSON data format</li>
              <li>Expands Google Maps short URLs to extract coordinates</li>
              <li>Geocodes addresses using MapTiler for missing coordinates</li>
              <li>Adds timestamps and normalizes all data</li>
              <li>Imports places to your map and database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

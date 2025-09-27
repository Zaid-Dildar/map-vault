// components/dashboard/ScrapingButton.tsx
"use client";

import { useState } from "react";

interface ScrapingButtonProps {
  userId: string;
}

export default function ScrapingButton({}: ScrapingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleScrape = async () => {
    setLoading(true);
    setStatus("Import functionality coming soon...");

    // Simulate API call delay
    setTimeout(() => {
      setStatus(
        "🚧 This feature is currently under development. Full Google Maps integration will be available soon!"
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {status && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div>
              <p className="text-blue-800 font-medium mb-1">
                Development Status
              </p>
              <p className="text-blue-700 text-sm">{status}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleScrape}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Checking Status...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Import from Google Maps
          </>
        )}
      </button>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">
          🔮 Coming Soon Features:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Secure Google OAuth integration
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Automatic saved places extraction
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Real-time import progress tracking
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Support for all Google Maps lists
          </li>
        </ul>
      </div>

      <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">⚠️</span>
          <span className="font-medium text-yellow-800">Demo Mode:</span>
        </div>
        <p className="text-yellow-700 mt-1">
          Currently showing sample data. The actual Google Maps scraping
          functionality is being developed and will securely import your real
          saved places.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface ExportButtonProps {
  onExportComplete?: (fileUrl: string) => void;
}

export default function ExportButton({}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: "csv" | "txt") => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert(`${format.toUpperCase()} export functionality coming soon!`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Export Your Saved Places</h3>

      <div className="flex gap-4">
        <button
          onClick={() => handleExport("csv")}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Coming Soon..." : "Export as CSV"}
        </button>

        <button
          onClick={() => handleExport("txt")}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Coming Soon..." : "Export as Text"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

interface ExportButtonProps {
  onExportComplete?: (fileUrl: string) => void;
}

export default function ExportButton({ onExportComplete }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const supabase = createClient();

  const handleExport = async (format: "csv" | "txt") => {
    setLoading(true);
    setStatus("Starting export...");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format, userId: user.id }),
      });

      if (!response.ok) throw new Error("Export failed");

      const result = await response.json();
      setStatus("Export completed!");

      if (onExportComplete && result.fileUrl) {
        onExportComplete(result.fileUrl);
      }
    } catch (error) {
      console.error("Export error:", error);
      setStatus("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Export Your Saved Places</h3>

      {status && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          {status}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => handleExport("csv")}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 transition-colors transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {loading ? "Exporting..." : "Export as CSV"}
        </button>

        <button
          onClick={() => handleExport("txt")}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 transition-colors transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {loading ? "Exporting..." : "Export as Text"}
        </button>
      </div>
    </div>
  );
}

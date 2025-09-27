"use client";

import { useState } from "react";
import { Place } from "@/lib/types";

interface ExportButtonProps {
  places: Place[];
  onExported?: (url: string) => void; // ✅ notify parent
}

export default function ExportButton({
  places,
  onExported,
}: ExportButtonProps) {
  const [loading, setLoading] = useState<"csv" | "txt" | null>(null);

  const handleExport = async (format: "csv" | "txt") => {
    setLoading(format);

    const res = await fetch("/api/exports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ places, format, listId: null }),
    });

    if (!res.ok) {
      console.error("Export failed:", await res.text());
      setLoading(null);
      return;
    }

    // 1. Read response as blob
    const blob = await res.blob();

    // 2. Create a temporary link for local download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saved_places.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // 3. Release memory
    window.URL.revokeObjectURL(url);

    // 4. Get Supabase-hosted file URL from headers
    const supabaseUrl = res.headers.get("X-File-Url");
    if (supabaseUrl && onExported) {
      onExported(supabaseUrl);
    }

    setLoading(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Export Your Saved Places</h3>

      <div className="flex gap-4">
        <button
          onClick={() => handleExport("csv")}
          disabled={loading !== null}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading === "csv" ? "Exporting..." : "Export as CSV"}
        </button>

        <button
          onClick={() => handleExport("txt")}
          disabled={loading !== null}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading === "txt" ? "Exporting..." : "Export as Text"}
        </button>
      </div>
    </div>
  );
}

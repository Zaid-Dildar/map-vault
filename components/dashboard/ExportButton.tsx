"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { Download, FileText } from "lucide-react";

interface ExportButtonProps {
  places: Place[];
  onExported?: (url: string) => void;
  variant?: "inline" | "card";
}

export default function ExportButton({
  places,
  onExported,
  variant = "inline",
}: ExportButtonProps) {
  const [loading, setLoading] = useState<"csv" | "txt" | null>(null);

  const handleExport = async (format: "csv" | "txt") => {
    setLoading(format);

    try {
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

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `saved_places.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      const supabaseUrl = res.headers.get("X-File-Url");
      if (supabaseUrl && onExported) onExported(supabaseUrl);
    } finally {
      setLoading(null);
    }
  };

  const Buttons = (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      <button
        onClick={() => handleExport("csv")}
        disabled={loading !== null}
        aria-label="Export saved places as CSV"
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading === "csv" ? (
          "Exporting..."
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export as CSV
          </>
        )}
      </button>

      <button
        onClick={() => handleExport("txt")}
        disabled={loading !== null}
        aria-label="Export saved places as Text"
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading === "txt" ? (
          "Exporting..."
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Export as Text
          </>
        )}
      </button>
    </div>
  );

  if (variant === "card") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Export Your Saved Places</h3>
        {Buttons}
      </div>
    );
  }

  return Buttons;
}

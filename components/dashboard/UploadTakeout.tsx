"use client";

import { useRef, useState } from "react";
import { Place } from "@/lib/types";

interface UploadTakeoutProps {
  onData: (places: Place[]) => void;
}

export default function UploadTakeout({ onData }: UploadTakeoutProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: Place[] | { error: string } = await res.json();

      if (res.ok && Array.isArray(data)) {
        onData(data);
      } else {
        alert((data as { error: string }).error ?? "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload Takeout JSON"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

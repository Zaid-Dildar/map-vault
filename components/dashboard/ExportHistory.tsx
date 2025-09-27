"use client";

import { useCallback, useEffect, useState } from "react";
import { Database } from "@/types/database";
import {
  Download,
  Trash2,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";

type ExportJob = Database["public"]["Tables"]["export_jobs"]["Row"];

export default function ExportHistory() {
  const [exports, setExports] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch exports for logged-in user
  const fetchExports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/exports/history");
      if (!res.ok) throw new Error("Failed to fetch export history");

      const json = await res.json();
      setExports(json.exports || []);
    } catch (err) {
      console.error("Failed to fetch exports:", err);
      setError("Failed to load export history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExports();
  }, [fetchExports]);

  const handleDownload = async (exportJob: ExportJob) => {
    try {
      const res = await fetch(`/api/exports/download?id=${exportJob.id}`);
      if (!res.ok) throw new Error("Failed to get file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `saved_places`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file");
    }
  };

  const handleDelete = async (exportJob: ExportJob) => {
    if (!confirm("Are you sure you want to delete this export?")) return;
    setDeletingId(exportJob.id);

    try {
      const res = await fetch(`/api/exports/history?id=${exportJob.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete export");

      setExports((prev) => prev.filter((exp) => exp.id !== exportJob.id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete export");
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: ExportJob["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      processing: { color: "bg-blue-100 text-blue-800", text: "Processing" },
      completed: { color: "bg-green-100 text-green-800", text: "Completed" },
      failed: { color: "bg-red-100 text-red-800", text: "Failed" },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Export History
        </h2>
        <div className="animate-pulse">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Export History
        </h2>
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Export History</h2>
        <p className="text-sm text-gray-600 mt-1">
          Download or delete your previous exports
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {exports.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No exports found</p>
            <p className="text-sm text-gray-400 mt-1">
              Your export history will appear here after you create your first
              export
            </p>
          </div>
        ) : (
          exports.map((exportJob) => (
            <div key={exportJob.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          Export #{exportJob.id.slice(0, 8)}
                        </p>
                        {getStatusBadge(exportJob.status)}
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {exportJob.format}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(exportJob.created_at)}</span>
                        </div>
                        {exportJob.total_places && (
                          <span>{exportJob.total_places} places</span>
                        )}
                        {exportJob.file_size && (
                          <span>{formatFileSize(exportJob.file_size)}</span>
                        )}
                      </div>
                      {exportJob.error_message && (
                        <p className="text-xs text-red-600 mt-1">
                          Error: {exportJob.error_message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {exportJob.status === "completed" && exportJob.file_url && (
                    <button
                      onClick={() => handleDownload(exportJob)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(exportJob)}
                    disabled={deletingId === exportJob.id}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === exportJob.id ? (
                      <>
                        <div className="w-3 h-3 mr-1 animate-spin rounded-full border border-red-700 border-t-transparent" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

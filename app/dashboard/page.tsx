import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import PlaceManager from "@/components/dashboard/PlaceMangaer";
import ExportHistory from "@/components/dashboard/ExportHistory";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data, error } = await supabase.storage.listBuckets();
  console.log(data, error);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              MapVault Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload your Google Maps Takeout data, search new places, and
              manage your saved locations.
            </p>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-3">
            📥 How to Get Your Google Maps Saved Places JSON
          </h2>
          <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-2">
            <li>
              Go to{" "}
              <a
                href="https://takeout.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Google Takeout
              </a>
            </li>
            <li>
              Deselect everything except <strong>Maps (Your Places)</strong>
            </li>
            <li>
              Choose <strong>JSON</strong> as the export format
            </li>
            <li>
              Click <strong>Create export</strong> → you&apos;ll get a{" "}
              <code>.zip</code> by email/download
            </li>
            <li>
              Inside the <code>.zip</code>, go to{" "}
              <code>Takeout/Maps (your places)/</code> and find{" "}
              <strong>Saved Places.json</strong>
            </li>
            <li>Upload that file below to see your saved places</li>
          </ol>
        </div>

        {/* Place Manager (map + search + upload + list + export) */}
        <PlaceManager />

        {/* Export History */}
        <ExportHistory />
      </main>
    </div>
  );
}

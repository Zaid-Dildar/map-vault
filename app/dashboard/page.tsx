import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import PlaceManager from "@/components/dashboard/PlaceMangaer";
import ExportHistory from "@/components/dashboard/ExportHistory";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-2 flex items-center justify-between gap-4">
          <span className="max-sm:w-10 max-sm:h-10 max-md:w-25 max-md:h-25">
            <Image
              src="/mapvault-logo.png"
              alt="MapVault logo"
              width={150}
              height={150}
              className="w-[120px] sm:w-[150px] h-auto"
            />
          </span>
          <div className="hidden lg:block text-center">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1 truncate">
              Upload your Google Maps Takeout data, search new places, and
              manage your saved locations.
            </p>
          </div>
          <div className="flex-shrink-0">
            <AuthButton />
          </div>
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
      <footer className="px-6 py-8">
        <div className="mx-auto max-w-7xl text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MapVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

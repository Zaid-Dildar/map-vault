import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import ExportButton from "@/components/dashboard/ExportButton";
import MapView from "@/components/maps/MapView";
import ScrapingButton from "@/components/dashboard/ScrapingButton";

export default async function DashboardPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  // Mock data for demonstration
  const mockPlaces = [
    {
      id: "1",
      name: "Central Park",
      address: "New York, NY, USA",
      coordinates: [-73.9654, 40.7829] as [number, number],
      category: "Park",
    },
    {
      id: "2",
      name: "Times Square",
      address: "Manhattan, NY, USA",
      coordinates: [-73.9855, 40.758] as [number, number],
      category: "Landmark",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                MapVault Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Demo version - Full functionality coming soon
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Import Your Places
              </h2>
              <ScrapingButton userId={session.user.id} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Demo: Your Saved Places
              </h2>
              <MapView places={mockPlaces} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Statistics (Demo)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Places:</span>
                  <span className="font-semibold text-gray-900">
                    {mockPlaces.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
              </div>
            </div>

            <ExportButton />

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🚧 Under Development
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                This is a demo version. The full Google Maps integration and
                export functionality will be implemented soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import ExportButton from "@/components/dashboard/ExportButton";
import MapView from "@/components/maps/MapView";

export default async function DashboardPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  // Mock data for now - replace with actual scraped data
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
                Export your Google Maps saved places
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Your Saved Places Map
              </h2>
              <MapView places={mockPlaces} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Places Summary</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total Places:{" "}
                  <span className="font-semibold">{mockPlaces.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Last Updated: <span className="font-semibold">Just now</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ExportButton />

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Recent Exports</h3>
              <p className="text-sm text-gray-500">
                No exports yet. Start by clicking the export buttons above.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

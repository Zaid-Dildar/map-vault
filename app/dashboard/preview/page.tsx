// app/dashboard/preview/page.tsx
// This route bypasses authentication for Builder.io previews

import AuthButton from "@/components/auth/AuthButton";
import ExportButton from "@/components/dashboard/ExportButton";
import MapView from "@/components/maps/MapView";
import ScrapingButton from "@/components/dashboard/ScrapingButton";

export default function PreviewDashboardPage() {
  // Mock user session for preview
  const mockSession = {
    user: {
      id: "preview-user-123",
      email: "demo@example.com",
      name: "Demo User",
    },
  };

  // Mock places data for preview
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
    {
      id: "3",
      name: "Brooklyn Bridge",
      address: "Brooklyn, NY, USA",
      coordinates: [-73.9969, 40.7061] as [number, number],
      category: "Bridge",
    },
    {
      id: "4",
      name: "Statue of Liberty",
      address: "Liberty Island, NY, USA",
      coordinates: [-74.0445, 40.6892] as [number, number],
      category: "Monument",
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
                🎨 Builder.io Preview Mode - Full functionality in production
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                👤 {mockSession.user.email}
              </span>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
                Sign Out (Demo)
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Builder.io Preview Notice */}
        <div className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎨</div>
            <div>
              <h3 className="font-semibold text-purple-900">
                Builder.io Preview Mode
              </h3>
              <p className="text-sm text-purple-800 mt-1">
                You're viewing this in Builder.io with mock data. In production,
                this will show real Google Maps saved places after
                authentication.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scraping Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Import Your Places
              </h2>
              <ScrapingButton userId={mockSession.user.id} />
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Saved Places (Demo Data)
              </h2>
              <MapView places={mockPlaces} />
            </div>

            {/* Places List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Places List
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mockPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {place.name}
                      </h4>
                      <p className="text-sm text-gray-600">{place.address}</p>
                      {place.category && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {place.category}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {place.coordinates[1].toFixed(4)},{" "}
                      {place.coordinates[0].toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistics (Demo)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Places:</span>
                  <span className="font-semibold text-gray-900">
                    {mockPlaces.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-semibold text-gray-900">
                    {
                      new Set(mockPlaces.map((p) => p.category).filter(Boolean))
                        .size
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Exports:</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
              </div>
            </div>

            {/* Export Section */}
            <ExportButton />

            {/* Help Card */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🚀 Production Ready
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                This dashboard will connect to real Google Maps data when
                deployed to production with proper environment variables.
              </p>
              <div className="space-y-2 text-xs text-blue-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Google OAuth authentication
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Real-time data scraping
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  CSV/TXT export functionality
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

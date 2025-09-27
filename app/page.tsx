import AuthButton from "../components/auth/AuthButton";
import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="px-6 py-2">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center max-sm:mx-auto gap-2">
            <Image
              src="/mapvault-logo.png"
              alt="MapVault logo"
              width={150}
              height={150}
              className="inline-block"
            />
          </div>
          <div className="hidden sm:block">
            <AuthButton label="Start Exporting" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        {/* Hero */}
        <section>
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Export Your Google Maps Saved Places
                </h1>
                <p className="text-gray-600 mb-6">
                  Easily export all your saved places and lists from Google Maps
                  to CSV or text files. Perfect for backup, sharing, or data
                  analysis.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <AuthButton
                    label="Start Exporting Now"
                    className="w-full sm:w-auto"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Sign in with your Google account to access your saved places
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium">
                    Join 10,000+ users
                  </div>
                  <div className="bg-green-50 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium">
                    Over 1M places exported
                  </div>
                  <div className="bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-full text-xs font-medium">
                    Trusted by businesses
                    <span className="hidden lg:inline">
                      , researchers and travelers
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 overflow-hidden">
                  <Image
                    src="https://images.pexels.com/photos/7634233/pexels-photo-7634233.jpeg"
                    alt="Map with pins representing saved places"
                    width={640}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Problem
              </h2>
              <p className="text-gray-600">
                Google Maps doesn&apos;t let you export your saved places.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Solution
              </h2>
              <p className="text-gray-600">
                MapVault extracts and formats your data for you so you can own
                it and use it anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Everything you need to take your places with you
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Processed securely, no data stored permanently.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Export in seconds so you can get back to work.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Multiple Formats
              </h3>
              <p className="text-gray-600">
                Choose CSV or TXT to fit your workflow.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">🗺️</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Interactive Maps
              </h3>
              <p className="text-gray-600">
                Preview and verify your places before export.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Email Notifications
              </h3>
              <p className="text-gray-600">
                We&apos;ll let you know when your export is ready.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">♻️</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Export History
              </h3>
              <p className="text-gray-600">
                Re-download previous exports anytime.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">
                Is my data safe?
              </summary>
              <p className="text-gray-600 mt-2">
                Yes, we use secure processing and don&apos;t store your data
                permanently.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">
                How many places can I export?
              </summary>
              <p className="text-gray-600 mt-2">
                Depends on your plan. Free includes 100 places; Pro is
                unlimited.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">
                What formats are supported?
              </summary>
              <p className="text-gray-600 mt-2">
                CSV and TXT files are supported.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">
                How long does it take?
              </summary>
              <p className="text-gray-600 mt-2">
                Usually under 2 minutes, often just a few seconds.
              </p>
            </details>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-12">
          <div className="bg-white rounded-lg shadow p-8 md:p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Own your data. Use it anywhere.
            </h2>
            <p className="text-gray-600 mt-2">
              Export your Google Maps saved places in just a few clicks.
            </p>
            <div className="mt-6 flex justify-center">
              <AuthButton label="Export My Places" />
            </div>
          </div>
        </section>
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

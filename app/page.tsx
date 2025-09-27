import AuthButton from "../components/auth/AuthButton";
import { createServerClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="px-6 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/globe.svg" alt="MapVault logo" width={28} height={28} className="imgLight" />
            <Image src="/globe.svg" alt="MapVault logo" width={28} height={28} className="imgDark" />
            <span className="text-xl font-bold text-gray-900">MapVault</span>
          </div>
          <div className="hidden sm:block">
            <AuthButton label="Start Exporting" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24">
        {/* Hero */}
        <section className="pt-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Export Your Google Maps Saved Places
                </h1>
                <p className="text-gray-600 mb-6">
                  Easily export all your saved places and lists from Google Maps to CSV or text files. Perfect for backup, sharing, or data analysis.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <AuthButton label="Start Exporting Now" />
                  <AuthButton label="Try Free Export" className="bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md ring-1 ring-blue-200 hover:ring-blue-300 font-medium" />
                </div>
                <p className="text-xs text-gray-500 mt-4">Sign in with your Google account to access your saved places</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium">Join 10,000+ users</div>
                  <div className="bg-green-50 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium">Over 1M places exported</div>
                  <div className="bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-full text-xs font-medium">Trusted by travelers, researchers, businesses</div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <Image src="https://images.pexels.com/photos/7634233/pexels-photo-7634233.jpeg" alt="Map with pins representing saved places" width={640} height={400} className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Problem</h2>
              <p className="text-gray-600">Google Maps doesn't let you export your saved places.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Solution</h2>
              <p className="text-gray-600">MapVault extracts and formats your data for you so you can own it and use it anywhere.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Everything you need to take your places with you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
              <p className="text-gray-600">Processed securely, no data stored permanently.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
              <p className="text-gray-600">Export in seconds so you can get back to work.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-semibold text-gray-900 mb-1">Multiple Formats</h3>
              <p className="text-gray-600">Choose CSV or TXT to fit your workflow.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">🗺️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Interactive Maps</h3>
              <p className="text-gray-600">Preview and verify your places before export.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Notifications</h3>
              <p className="text-gray-600">We'll let you know when your export is ready.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl mb-2">♻️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Export History</h3>
              <p className="text-gray-600">Re-download previous exports anytime.</p>
            </div>
          </div>
        </section>

        {/* Screenshots / Demo */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">See how it works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Google Maps saved places</h3>
              <Image src="https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg" alt="Phone and travel items over a map showing saved places" width={480} height={280} className="w-full h-auto" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">MapVault dashboard preview</h3>
              <Image src="https://images.pexels.com/photos/9182457/pexels-photo-9182457.jpeg" alt="Navigation app in use, representing interactive map and dashboard" width={480} height={280} className="w-full h-auto" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Choose export format</h3>
              <Image src="https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg" alt="Data and export concept on computer screen" width={480} height={280} className="w-full h-auto" />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">CSV preview</h3>
              <Image src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg" alt="Spreadsheet-style charts representing CSV data" width={480} height={280} className="w-full h-auto" />
            </div>
          </div>
          <div className="mt-6">
            <AuthButton label="Export My Places" />
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Simple pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900">Free</h3>
              <p className="text-gray-600 text-sm mt-1">Perfect for casual users</p>
              <div className="mt-4 text-3xl font-bold text-gray-900">$0</div>
              <ul className="mt-4 text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Export up to 100 places</li>
                <li>CSV or TXT</li>
                <li>Email notifications</li>
              </ul>
              <div className="mt-6"><AuthButton label="Try Free Export" /></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 ring-2 ring-blue-600">
              <h3 className="font-semibold text-gray-900">Pro</h3>
              <p className="text-gray-600 text-sm mt-1">For power users and businesses</p>
              <div className="mt-4 text-3xl font-bold text-gray-900">$9<span className="text-base font-medium">/mo</span></div>
              <ul className="mt-4 text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Unlimited places</li>
                <li>Priority processing</li>
                <li>Export history</li>
              </ul>
              <div className="mt-6"><AuthButton label="Upgrade to Pro" /></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900">Enterprise</h3>
              <p className="text-gray-600 text-sm mt-1">Custom solutions for organizations</p>
              <div className="mt-4 text-3xl font-bold text-gray-900">Custom</div>
              <ul className="mt-4 text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>SLAs and support</li>
                <li>Team features</li>
                <li>Custom integrations</li>
              </ul>
              <div className="mt-6"><AuthButton label="Contact Sales" /></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">Is my data safe?</summary>
              <p className="text-gray-600 mt-2">Yes, we use secure processing and don't store your data permanently.</p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">How many places can I export?</summary>
              <p className="text-gray-600 mt-2">Depends on your plan. Free includes 100 places; Pro is unlimited.</p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">What formats are supported?</summary>
              <p className="text-gray-600 mt-2">CSV and TXT files are supported.</p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="cursor-pointer font-semibold text-gray-900">How long does it take?</summary>
              <p className="text-gray-600 mt-2">Usually under 2 minutes, often just a few seconds.</p>
            </details>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-12">
          <div className="bg-white rounded-lg shadow p-8 md:p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Own your data. Use it anywhere.</h2>
            <p className="text-gray-600 mt-2">Export your Google Maps saved places in just a few clicks.</p>
            <div className="mt-6 flex justify-center">
              <AuthButton label="Export My Places" />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-8">
        <div className="mx-auto max-w-7xl text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} MapVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

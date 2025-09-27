import AuthButton from "../components/auth/AuthButton";
import { createServerClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MapVault</h1>
          <p className="text-gray-600">
            Export your Google Maps saved places to CSV or text files
          </p>
        </div>

        <div className="space-y-4">
          <AuthButton />
        </div>

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Sign in with your Google account to access your saved places</p>
        </div>
      </div>
    </div>
  );
}

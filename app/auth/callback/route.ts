import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    });

    // Exchange code for session
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.session?.user) {
      const user = data.session.user;

      // ✅ Ensure user exists in public.users table
      await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
      });
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Runs before each page. Asking Supabase who is logged in refreshes an expired
// login cookie, so server pages (like /review) keep recognising the visitor.
export async function middleware(request) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without the Supabase settings there is no login to refresh. Let the page
  // load instead of failing every request with a 500 error.
  if (!url || !key) {
    console.error("middleware: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
    return response;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    // If Supabase is slow or unreachable, stop waiting after 4 seconds so the
    // page still loads instead of Vercel timing out the whole request.
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Supabase did not answer within 4 seconds")), 4000);
    });
    try {
      await Promise.race([supabase.auth.getUser(), timeout]);
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    // A bad setting or a Supabase outage should not take the whole site down.
    // The visitor is simply treated as logged out for this request.
    console.error("middleware: could not refresh the Supabase login", error);
  }

  return response;
}

// Skip Next's build files and images; they never need the login.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

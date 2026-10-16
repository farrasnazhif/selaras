import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next({ request });
  const { url, key } = getPublicEnv();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });
  const { data, error } = await supabase.auth.getClaims();
  if (/^\/(kelas|jadwal|sesi|progres)(\/|$)/.test(request.nextUrl.pathname) && (error || !data?.claims)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    const redirect = NextResponse.redirect(login);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/kelas/:path*",
    "/jadwal/:path*",
    "/sesi/:path*",
    "/progres/:path*",
    "/login",
    "/register",
    "/auth/:path*",
    "/api/:path*",
  ],
};

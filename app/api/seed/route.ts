import { seedScenarios } from "@/lib/seedScenarios";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

async function requireUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const cookieStore = cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function POST() {
  try {
    const user = await requireUser();
    if (!user) {
      return Response.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    if (process.env.NODE_ENV === "production" && process.env.ALLOW_SCENARIO_SEED !== "true") {
      return Response.json({ success: false, error: "Scenario seeding is disabled" }, { status: 403 });
    }

    await seedScenarios();

    return Response.json({
      success: true,
      message: "Scenarios seeded successfully",
    });
  } catch (error) {
    console.error("[API /seed] Seed failed:", error);
    return Response.json(
      { success: false, error: "Unable to seed scenarios" },
      { status: 500 }
    );
  }
}

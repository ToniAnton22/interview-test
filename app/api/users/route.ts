import { validateUser } from "@/lib/utils/supabase/initSupabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  try {
    const { user, supabase } = await validateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data, error } = await supabase.from("users").select(
      `
         id,
         name
        `,
    );

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Users not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

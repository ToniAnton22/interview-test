import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateProjectInput } from "@/types/project";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const body: CreateProjectInput = await request.json();

    if (!body.name || !body.deadline || !body.assigned_to) {
      return NextResponse.json(
        { error: "Missing required fields: name, deadline, assigned_to" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: body.name,
        description: body.description || null,
        status: body.status || "active",
        deadline: body.deadline,
        assigned_to: body.assigned_to,
        budget: body.budget || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

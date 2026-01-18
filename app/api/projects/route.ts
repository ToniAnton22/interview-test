import { createClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateProjectInput } from "@/types/project";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const assignee = searchParams.get("assignee");

    let query = supabase
      .from("projects")
      .select(
        `
          *,
          assigned_user:users!assigned_to (id, name)
        `,
      )
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (assignee) {
      query = query.eq("assigned_to", assignee);
    }
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,assigned_to.ilike.%${search}%`,
      );
    }

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

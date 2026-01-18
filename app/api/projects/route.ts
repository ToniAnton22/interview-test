import { createClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateProjectInput } from "@/types/project";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const assignee = searchParams.get("assignee");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(
      searchParams.get("limit") || '10',
      10,
    );

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query for data
    let query = supabase
      .from("projects")
      .select(
        `
          *,
          assigned_user:users!assigned_to (id, name)
        `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (assignee) {
      query = query.eq("assigned_to", assignee);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateProjectInput = await request.json();

    if (!body.name || !body.deadline) {
      return NextResponse.json(
        { error: "Missing required fields: name, deadline" },
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
        assigned_to: user.id, // Owner is current user
        budget: body.budget || 0,
      })
      .select(
        `
        *,
        assigned_user:users!assigned_to (
          id,
          name
        )
      `,
      )
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

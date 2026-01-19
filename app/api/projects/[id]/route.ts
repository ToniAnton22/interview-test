import { NextRequest, NextResponse } from "next/server";
import { UpdateProjectInput } from "@/types/project";
import { validateUser } from "@/lib/utils/supabase/initSupabase";
import { pickDefined } from "@/lib/utils/pickDefined";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const { user, supabase } = await validateUser();

    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
          *,
          assigned_user:users!assigned_to (id, name)
        `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
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

/**
 * Update project endpoint.
 * 
 * Row-Level Security (RLS) ensures users can only update their own projects.
 * Even if this API route is compromised, the database policies prevent
 * unauthorized modifications. Defense in depth.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { user, supabase } = await validateUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const { data: project } = await supabase
      .from("projects")
      .select("assigned_to")
      .eq("id", id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.assigned_to !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own projects" },
        { status: 403 },
      );
    }

    const body: UpdateProjectInput = await request.json();

    const updateData = pickDefined(body, [
      "name",
      "description",
      "status",
      "deadline",
      "budget",
    ] as const);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
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
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
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

/**
 * Delete project endpoint.
 * 
 * RLS policies enforce that only the project owner (assigned_to) can delete.
 * This is a hard delete - consider implementing soft deletes for production
 * (add a `deleted_at` column and filter in queries instead).
 */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const { user, supabase } = await validateUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const { data: project } = await supabase
      .from("projects")
      .select("assigned_to")
      .eq("id", id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.assigned_to !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own projects" },
        { status: 403 },
      );
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

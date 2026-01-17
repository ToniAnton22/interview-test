import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { UpdateProjectInput } from "@/types/project";
import { cookies } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = cookies();
    const { id } = await params;
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = cookies();
    const { id } = await params;
    const supabase = createClient(cookieStore);
    const body: UpdateProjectInput = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.deadline !== undefined) updateData.deadline = body.deadline;
    if (body.assigned_to !== undefined)
      updateData.assigned_to = body.assigned_to;
    if (body.budget !== undefined) updateData.budget = body.budget;

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
      .select()
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

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = cookies();
    const { id } = await params;
    const supabase = createClient(cookieStore);
    console.log(id);
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

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch user's export history
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: exports, error } = await supabase
      .from("export_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ exports: exports || [] });
  } catch (error) {
    console.error("Failed to fetch export history:", error);
    return NextResponse.json(
      { error: "Failed to fetch export history" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an export job and its file
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const exportId = searchParams.get("id");

    if (!exportId) {
      return NextResponse.json(
        { error: "Export ID is required" },
        { status: 400 }
      );
    }

    // First, get the export job to ensure it belongs to the user and get file info
    const { data: exportJob, error: fetchError } = await supabase
      .from("export_jobs")
      .select("*")
      .eq("id", exportId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !exportJob) {
      return NextResponse.json(
        { error: "Export not found or access denied" },
        { status: 404 }
      );
    }

    // Delete from storage bucket if file exists
    if (exportJob.file_url) {
      const fileName = `${user.id}/${exportJob.id}.${exportJob.format}`;

      const { error: storageError } = await supabase.storage
        .from("exports")
        .remove([fileName]);

      if (storageError) {
        console.error("Storage deletion failed:", storageError);
        // Continue with database deletion even if storage fails
        // In production, you might want to handle this differently
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("export_jobs")
      .delete()
      .eq("id", exportId)
      .eq("user_id", user.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete export:", error);
    return NextResponse.json(
      { error: "Failed to delete export" },
      { status: 500 }
    );
  }
}

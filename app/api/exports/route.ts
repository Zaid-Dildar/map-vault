import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // FIXED: Ensure user exists in public.users table (required for foreign key constraint)
  const { error: userUpsertError } = await supabase.from("users").upsert({
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
  });

  if (userUpsertError) {
    console.error("User upsert failed:", userUpsertError);
    return NextResponse.json(
      {
        error: "Failed to create user record",
        details: userUpsertError.message,
      },
      { status: 500 }
    );
  }

  const { places, format, listId } = (await req.json()) as {
    places: {
      name: string;
      address?: string;
      lat: number;
      lng: number;
      url?: string;
      date?: string;
    }[];
    format: "csv" | "txt";
    listId?: string | null;
  };

  try {
    // 1. Insert export job with proper error handling
    const { data: job, error: jobError } = await supabase
      .from("export_jobs")
      .insert({
        user_id: user.id,
        list_id: listId ?? null,
        format,
        status: "pending",
        total_places: places.length,
        processed_places: 0,
      } satisfies Database["public"]["Tables"]["export_jobs"]["Insert"])
      .select()
      .single();

    if (jobError) {
      console.error("Export job creation failed:", jobError);
      return NextResponse.json(
        {
          error: "Failed to create export job",
          details: jobError.message,
        },
        { status: 500 }
      );
    }

    // 2. Generate content
    let content = "";
    if (format === "csv") {
      const headers = [
        "Name",
        "Address",
        "Latitude",
        "Longitude",
        "URL",
        "Date",
      ];
      const rows = places.map((p) => [
        `"${p.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
        `"${(p.address || "").replace(/"/g, '""')}"`,
        p.lat,
        p.lng,
        `"${(p.url || "").replace(/"/g, '""')}"`,
        `"${(p.date || "").replace(/"/g, '""')}"`,
      ]);
      content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    } else {
      content = places
        .map(
          (p, i) =>
            `${i + 1}. ${p.name}\n   Address: ${
              p.address || "N/A"
            }\n   Coordinates: (${p.lat}, ${p.lng})\n   URL: ${
              p.url ?? "N/A"
            }\n   Date: ${p.date || "N/A"}\n`
        )
        .join("\n");
    }

    const fileBuffer = Buffer.from(content, "utf-8");
    const fileName = `${user.id}/${job.id}.${format}`;
    const fileSize = fileBuffer.length;

    // 3. Upload to Supabase storage
    console.log(
      "Uploading file:",
      fileName,
      "Size:",
      fileSize,
      "User ID:",
      user.id
    );

    const { error: uploadError } = await supabase.storage
      .from("exports")
      .upload(fileName, fileBuffer, {
        contentType: format === "csv" ? "text/csv" : "text/plain",
        upsert: true,
      });

    console.log("Upload result:", uploadError);

    if (uploadError) {
      console.error("File upload failed:", uploadError);

      // Update job status to failed
      await supabase
        .from("export_jobs")
        .update({
          status: "failed",
          error_message: uploadError.message,
        } satisfies Database["public"]["Tables"]["export_jobs"]["Update"])
        .eq("id", job.id)
        .eq("user_id", user.id); // Add this to satisfy RLS policy

      return NextResponse.json(
        {
          error: "File upload failed",
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("exports").getPublicUrl(fileName);

    // 4. Update job as completed
    const { error: updateError } = await supabase
      .from("export_jobs")
      .update({
        status: "completed",
        file_url: publicUrl,
        file_size: fileSize,
        processed_places: places.length,
        completed_at: new Date().toISOString(),
      } satisfies Database["public"]["Tables"]["export_jobs"]["Update"])
      .eq("id", job.id)
      .eq("user_id", user.id); // Add this to satisfy RLS policy

    if (updateError) {
      console.error("Job status update failed:", updateError);
      // Don't return error here since file was already uploaded successfully
    }

    // 5. Return file as downloadable response + Supabase public URL
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": format === "csv" ? "text/csv" : "text/plain",
        "Content-Disposition": `attachment; filename="saved_places.${format}"`,
        "X-File-Url": publicUrl,
      },
    });
  } catch (error) {
    console.error("Unexpected error in export:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

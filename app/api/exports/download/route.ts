import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { searchParams } = new URL(req.url);
  const exportId = searchParams.get("id");
  if (!exportId)
    return NextResponse.json({ error: "Missing export ID" }, { status: 400 });

  const { data: exportJob } = await supabase
    .from("export_jobs")
    .select("*")
    .eq("id", exportId)
    .eq("user_id", user!.id)
    .single();

  if (!exportJob || !exportJob.file_url)
    return NextResponse.json({ error: "Export not found" }, { status: 404 });

  const filePath = `${user!.id}/${exportJob.id}.${exportJob.format}`;
  const { data, error } = await supabase.storage
    .from("exports")
    .createSignedUrl(filePath, 60);

  if (error || !data?.signedUrl)
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );

  return NextResponse.redirect(data.signedUrl);
}

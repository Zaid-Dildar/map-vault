import { NextRequest, NextResponse } from "next/server";

type StoredFile = {
  filename: string;
  content: string;
  mime: string;
};

// In-memory store for generated exports. This is ephemeral and meant for dev/testing.
const fileStore = new Map<string, StoredFile>();

function generateToken() {
  // Use web crypto when available
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { format, userId } = body ?? {};

    if (!format || (format !== "csv" && format !== "txt")) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    // For now, create a small export using placeholder rows derived from the userId
    // In a full implementation this would query the user's saved places.
    const rows = [
      ["name", "address", "lat", "lng"],
      ["Sample Place 1", "123 Main St", "37.7749", "-122.4194"],
      ["Sample Place 2", "456 Oak Ave", "34.0522", "-118.2437"],
    ];

    let content = "";
    let mime = "text/plain";
    let filename = `mapvault-export-${userId ?? "anon"}.${format}`;

    if (format === "csv") {
      content = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      mime = "text/csv";
    } else {
      // txt format: simple tab separated values
      content = rows.map((r) => r.join("\t")).join("\n");
      mime = "text/plain";
    }

    const token = generateToken();
    fileStore.set(token, { filename, content, mime });

    const url = `${new URL(req.url).origin}/api/export?token=${token}`;

    return NextResponse.json({ fileUrl: url });
  } catch (err) {
    console.error("Export API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const stored = fileStore.get(token);
    if (!stored) {
      return NextResponse.json({ error: "File not found or expired" }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", stored.mime);
    headers.set("Content-Disposition", `attachment; filename="${stored.filename}"`);

    return new NextResponse(stored.content, { headers });
  } catch (err) {
    console.error("Export GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

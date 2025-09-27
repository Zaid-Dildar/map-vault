import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Export functionality coming soon",
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    exports: [],
  });
}

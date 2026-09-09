import { NextResponse } from "next/server";

let onlineCount = 0;

export async function GET() {
  return NextResponse.json({ count: onlineCount });
}

export async function POST() {
  onlineCount = Math.max(0, onlineCount + 1);
  return NextResponse.json({ count: onlineCount });
}

export async function DELETE() {
  onlineCount = Math.max(0, onlineCount - 1);
  return NextResponse.json({ count: onlineCount });
}

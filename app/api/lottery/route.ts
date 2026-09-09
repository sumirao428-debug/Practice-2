import { NextResponse } from "next/server";

export async function GET() {
  const won = Math.random() < 0.3;
  return NextResponse.json({ won, message: won ? "恭喜中獎！🎉" : "很遺憾，未中獎" });
}

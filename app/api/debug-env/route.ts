import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";

export async function GET() {
  const hasMongoUri = !!process.env.MONGODB_URI;
  const hasJwtSecret = !!process.env.JWT_SECRET;
  const uriPrefix = process.env.MONGODB_URI?.slice(0, 20) ?? "(not set)";

  let dbStatus = "not tested";
  let dbError = "";

  try {
    await connectDB();
    dbStatus = "connected";
  } catch (err) {
    dbStatus = "failed";
    dbError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    hasMongoUri,
    hasJwtSecret,
    uriPrefix,
    dbStatus,
    dbError,
  });
}

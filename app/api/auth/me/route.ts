import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/users";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

async function getPayload(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload(req);
    if (!payload) return NextResponse.json({ error: "未登入" }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) return NextResponse.json({ error: "使用者不存在" }, { status: 404 });

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar ?? null,
    });
  } catch (err) {
    console.error("[me]", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoose";
import User from "@/models/users";
import { signToken, COOKIE_NAME, cookieOptions, ADMIN_EMAIL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "請填寫 Email 和密碼" }, { status: 400 });
    }

    const user = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Email 或密碼錯誤" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Email 或密碼錯誤" }, { status: 401 });
    }

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.role !== "admin") {
      await User.findByIdAndUpdate(user._id, { role: "admin" });
      user.role = "admin";
    }

    const token = signToken({ userId: String(user._id), email: user.email! });
    const res = NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar ?? null,
    });
    res.cookies.set(COOKIE_NAME, token, cookieOptions);
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "伺服器錯誤，請稍後再試" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoose";
import User from "@/models/users";
import { ADMIN_EMAIL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "請填寫姓名、Email 和密碼" }, { status: 400 });
    }

    const existing = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });

    if (existing && !existing.passwordHash) {
      const passwordHash = await bcrypt.hash(password, 12);
      const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
      await User.findByIdAndUpdate(existing._id, { passwordHash, role });
      return NextResponse.json(
        { _id: existing._id, name: existing.name, email: existing.email },
        { status: 201 }
      );
    }

    if (existing) {
      return NextResponse.json({ error: "此 Email 已被註冊" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
    const user = await User.create({ name, email, passwordHash, role });

    return NextResponse.json(
      { _id: user._id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "伺服器錯誤，請稍後再試" }, { status: 500 });
  }
}

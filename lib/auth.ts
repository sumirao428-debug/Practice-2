import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("請在 .env.local 設定 JWT_SECRET");
  return s;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, secret()) as JwtPayload;
}

export const COOKIE_NAME = "token";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "Sumi@gmail.com";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

import { NextRequest, NextResponse } from "next/server";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("n");

  if (raw === null || raw.trim() === "") {
    return NextResponse.json({ error: "請提供參數 n" }, { status: 400 });
  }

  const n = Number(raw);

  if (!Number.isInteger(n) || isNaN(n)) {
    return NextResponse.json({ error: "n 必須是整數" }, { status: 400 });
  }

  return NextResponse.json({ n, prime: isPrime(n) });
}

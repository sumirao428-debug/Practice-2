import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Transaction from "@/models/transactions";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const filter = userId ? { userId } : {};
  const transactions = await Transaction.find(filter).sort({ date: -1 });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const transaction = await Transaction.create(body);
  return NextResponse.json(transaction, { status: 201 });
}

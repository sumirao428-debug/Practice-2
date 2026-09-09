import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Transaction from "@/models/transactions";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    return NextResponse.json({ error: "找不到該筆交易" }, { status: 404 });
  }
  return NextResponse.json(transaction);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const transaction = await Transaction.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  );
  if (!transaction) {
    return NextResponse.json({ error: "找不到該筆交易" }, { status: 404 });
  }
  return NextResponse.json(transaction);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const transaction = await Transaction.findByIdAndDelete(id);
  if (!transaction) {
    return NextResponse.json({ error: "找不到該筆交易" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type TransactionType = "income" | "expense";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true, collection: "transactions" }
);

const Transaction: Model<ITransaction> =
  mongoose.models.transactions ??
  mongoose.model<ITransaction>("transactions", TransactionSchema);

export default Transaction;

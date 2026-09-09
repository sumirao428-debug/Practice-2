import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  number?: string;
  email?: string;
  passwordHash?: string;
  role: "admin" | "user";
  avatar?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    number: { type: String, trim: true },
    email: { type: String, trim: true, sparse: true, index: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String },
  },
  { timestamps: true, collection: "users" }
);

const User: Model<IUser> =
  mongoose.models.users ?? mongoose.model<IUser>("users", UserSchema);

export default User;

import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | undefined;
}

async function connectDB() {
  if (global._mongooseConn) return global._mongooseConn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("請在 .env.local 設定 MONGODB_URI");
  global._mongooseConn = await mongoose.connect(uri);
  return global._mongooseConn;
}

export default connectDB;

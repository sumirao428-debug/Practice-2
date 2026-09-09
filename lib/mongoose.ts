import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("請在 .env.local 設定 MONGODB_URI");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | undefined;
}

async function connectDB() {
  if (global._mongooseConn) return global._mongooseConn;
  global._mongooseConn = await mongoose.connect(uri);
  return global._mongooseConn;
}

export default connectDB;

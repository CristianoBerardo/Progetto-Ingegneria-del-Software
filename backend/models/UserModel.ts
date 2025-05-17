import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  uid: string;
  email: string;
  name: string;
  role: string;
}

const UserSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: false, default: "" },
  role: { type: String, required: false, default: "client" },
});

export default model<IUser>("User", UserSchema);

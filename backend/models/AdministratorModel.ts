import { Document, Schema, model } from "mongoose";
import { Role } from "../types/Role";

export interface IAdministrator extends Document {
  uid: string; // Firebase UID
  email: string;
  roles: string;
}

export const AdministratorSchema = new Schema<IAdministrator>({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  roles: {
    type: String,
    required: true,
    default: Role.administrator, // Default role for administrators
  },
});

export default model<IAdministrator>("Administrator", AdministratorSchema);

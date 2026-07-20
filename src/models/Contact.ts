import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  projectSlug: string;
  projectName: string;
  message: string;
  status: "Chờ liên hệ" | "Đã liên hệ" | "Đang thương lượng" | "Đã chốt";
  notes: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9+\-\s]{7,20}$/, "Số điện thoại không hợp lệ"],
    },
    projectSlug: { type: String, default: "general", trim: true },
    projectName: { type: String, default: "Tư vấn chung", trim: true },
    message: { type: String, default: "", maxlength: 2000 },
    status: {
      type: String,
      enum: ["Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"],
      default: "Chờ liên hệ",
    },
    notes: { type: String, default: "", maxlength: 5000 },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", ContactSchema);

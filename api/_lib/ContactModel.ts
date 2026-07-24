import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 200 },
  email:       { type: String, required: true, trim: true, maxlength: 200 },
  phone:       { type: String, required: true, trim: true, maxlength: 20 },
  projectSlug: { type: String, default: "general" },
  projectName: { type: String, default: "Tư vấn chung" },
  message:     { type: String, default: "", maxlength: 2000 },
  status:      { type: String, default: "Chờ liên hệ", enum: ["Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"] },
  notes:       { type: String, default: "", maxlength: 5000 },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

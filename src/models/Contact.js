const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    projectType: { type: String, default: "" },
    budget: { type: String, default: "" },
    message: { type: String, default: "" },
    source: { type: String, default: "" },
    responses: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);

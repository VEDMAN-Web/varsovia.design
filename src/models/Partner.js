const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    logo:    { type: String, default: "" },
    website: { type: String, default: "" },
    order:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);

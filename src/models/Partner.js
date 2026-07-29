const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const partnerSchema = new mongoose.Schema(
  {
    name: { ...localizedField(), required: true },
    logo: { type: String, default: "" },
    website: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Partner", partnerSchema);

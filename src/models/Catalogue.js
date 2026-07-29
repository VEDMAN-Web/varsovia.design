const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const catalogueSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    coverImage: { type: String, default: "" },
    downloadUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Catalogue", catalogueSchema);

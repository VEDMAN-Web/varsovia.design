const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const catalogueSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    category: localizedField(),
    coverImage: { type: String, default: "" },
    downloadUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    downloadName: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Catalogue", catalogueSchema);

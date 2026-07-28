const mongoose = require("mongoose");

const catalogueSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    coverImage:  { type: String, default: "" },
    downloadUrl: { type: String, default: "" },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catalogue", catalogueSchema);

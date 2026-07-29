const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const showcaseSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    category: localizedField("Home case"),
    image: { type: String, default: "" },
    location: localizedField(),
    typeLabel: localizedField("Type"),
    typeValue: localizedField(),
    supplyArea: localizedField(),
    gallery: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Showcase", showcaseSchema);

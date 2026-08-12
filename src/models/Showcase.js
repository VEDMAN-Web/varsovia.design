const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const showcaseSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    category: localizedField("Home case"),
    /** Furniture IA child slug (kitchens, wardrobes, …) for Group A cross-linking */
    furnitureSlug: { type: String, default: "" },
    image: { type: String, default: "" },
    location: localizedField(),
    typeLabel: localizedField("Type"),
    typeValue: localizedField(),
    supplyArea: localizedField(),
    gallery: [{ type: String }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Showcase", showcaseSchema);

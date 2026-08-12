const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const productSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    slug: { type: String, unique: true, sparse: true },
    description: localizedField(),
    image: { type: String, default: "" },
    category: { type: String, default: "Kitchen" },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    gallery: [{ type: String }],
    fullDescription: localizedField(),
    features: [{ text: mongoose.Schema.Types.Mixed }],
    specs: [
      {
        label: mongoose.Schema.Types.Mixed,
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);

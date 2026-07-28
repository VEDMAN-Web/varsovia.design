const mongoose = require("mongoose");

const showcaseSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    category:    { type: String, default: "Home case" }, // matches ShowcaseTab values
    image:       { type: String, default: "" },
    location:    { type: String, default: "" },
    typeLabel:   { type: String, default: "Type" },
    typeValue:   { type: String, default: "" },
    supplyArea:  { type: String, default: "" },
    gallery:     [{ type: String }],
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Showcase", showcaseSchema);

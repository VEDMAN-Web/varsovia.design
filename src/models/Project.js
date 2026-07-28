const mongoose = require("mongoose");

const PROJECT_CATEGORIES = [
  "Kitchen",
  "Bedroom",
  "Bathroom",
  "Door & Windows",
  "Whole House Solutions",
  "Furniture",
];

const projectSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true },
    slug:            { type: String, unique: true, sparse: true },
    description:     { type: String, default: "" },
    location:        { type: String, default: "" },
    coverImage:      { type: String, default: "" },
    gallery:         [{ type: String }],
    category:        { type: String, default: "Kitchen" },
    featured:        { type: Boolean, default: false },
    interiorCatalog: { type: Boolean, default: true },
    subcategory:     { type: String, default: "" },
    shape:           { type: String, default: "" },
    style:           { type: String, default: "" },
    color:           { type: String, default: "" },
    material:        { type: String, default: "" },
    finish:          { type: String, default: "" },
    price:           { type: Number, default: 0 },
    isNew:           { type: Boolean, default: false },
    order:           { type: Number, default: 0 },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

module.exports = mongoose.model("Project", projectSchema);
module.exports.PROJECT_CATEGORIES = PROJECT_CATEGORIES;

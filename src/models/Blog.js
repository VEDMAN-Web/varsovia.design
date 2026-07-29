const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const blogSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    excerpt: localizedField(),
    content: localizedField(),
    date: { type: String, default: "" },
    readTime: localizedField(),
    author: {
      name: mongoose.Schema.Types.Mixed,
      avatar: { type: String, default: "" },
    },
    image: { type: String, default: "" },
    views: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);

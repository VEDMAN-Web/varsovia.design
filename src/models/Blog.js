const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    excerpt:  { type: String, default: "" },
    content:  { type: String, default: "" },
    date:     { type: String, default: "" },
    readTime: { type: String, default: "" },
    author: {
      name:   { type: String, default: "" },
      avatar: { type: String, default: "" },
    },
    image:  { type: String, default: "" },
    views:  { type: Number, default: 0 },
    order:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const blogSectionSchema = new mongoose.Schema(
  {
    heading: mongoose.Schema.Types.Mixed,
    text: mongoose.Schema.Types.Mixed,
    image: { type: String, default: "" },
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    excerpt: localizedField(),
    content: localizedField(),
    category: localizedField(),
    date: { type: String, default: "" },
    readTime: localizedField(),
    author: {
      name: mongoose.Schema.Types.Mixed,
      avatar: { type: String, default: "" },
    },
    image: { type: String, default: "" },
    /** Admin CMS body blocks → mapped to detail-page sections on the site */
    sections: { type: [blogSectionSchema], default: [] },
    views: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);

const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const faqSchema = new mongoose.Schema(
  {
    question: { ...localizedField(), required: true },
    answer: { ...localizedField(), required: true },
    category: localizedField("Kitchen Interior"),
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FAQ", faqSchema);

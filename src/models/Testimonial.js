const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const testimonialSchema = new mongoose.Schema(
  {
    name: { ...localizedField(), required: true },
    role: localizedField(),
    quote: { ...localizedField(), required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Testimonial", testimonialSchema);

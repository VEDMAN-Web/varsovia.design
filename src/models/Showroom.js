const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const showroomSchema = new mongoose.Schema(
  {
    name: { ...localizedField(), required: true },
    location: localizedField(),
    image: { type: String, default: "" },
    address: localizedField(),
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Showroom", showroomSchema);

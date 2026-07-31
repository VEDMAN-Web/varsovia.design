const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const ICON_KEYS = ["eye", "ruler", "users", "box", "shield", "pen"];

const coreStrengthSchema = new mongoose.Schema(
  {
    title: { ...localizedField(), required: true },
    description: localizedField(),
    image: { type: String, default: "" },
    iconKey: { type: String, enum: ICON_KEYS, default: "eye" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CoreStrength", coreStrengthSchema);
module.exports.ICON_KEYS = ICON_KEYS;

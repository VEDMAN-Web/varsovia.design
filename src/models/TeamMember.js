const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { ...localizedField(), required: true },
    role: localizedField(),
    image: { type: String, default: "" },
    teamType: { type: String, enum: ["Italian", "Headquarter"], default: "Italian" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);

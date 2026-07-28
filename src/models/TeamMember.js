const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    role:     { type: String, default: "" },
    image:    { type: String, default: "" },
    teamType: { type: String, enum: ["Italian", "Headquarter"], default: "Italian" },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);

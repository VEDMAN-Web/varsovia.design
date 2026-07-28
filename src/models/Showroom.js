const mongoose = require("mongoose");

const showroomSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    location: { type: String, default: "" },
    image:    { type: String, default: "" },
    address:  { type: String, default: "" },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Showroom", showroomSchema);

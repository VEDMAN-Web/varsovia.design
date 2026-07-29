const mongoose = require("mongoose");

/** Stores plain string (legacy) or { en, th, pl } multilingual object. */
function localizedField(defaultValue = "") {
  return { type: mongoose.Schema.Types.Mixed, default: defaultValue };
}

module.exports = { localizedField };

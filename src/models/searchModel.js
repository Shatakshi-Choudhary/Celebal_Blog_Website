const mongoose = require("mongoose");

const yourSchema = new mongoose.Schema({
  // Your schema fields
});

// Add text index on the "fieldToSearch" field
yourSchema.index({ fieldToSearch: "text" });

const YourModel = mongoose.model("searchrModel", yourSchema);
module.exports = YourModel;

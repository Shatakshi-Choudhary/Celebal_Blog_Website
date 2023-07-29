const mongoose = require("mongoose");

const signedinSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
});

const SignedInModel = mongoose.model("SignedInModel", signedinSchema);
module.exports = SignedInModel;

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nameLastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialKey: { type: String, required: true, unique: true },
    predmet: [String],
    ocena: [String],
  },
  {
    cllection: "users",
  }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;

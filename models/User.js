var mongoose = require("mongoose");
const book = require("../models/Book");
// in liked why use string not relations ( relations is the correct way )
const UserSchema = mongoose.Schema({
  Email: {
    type: String,
    require: true,
    unique: true,
  },
  Password: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  DoB: {
    type: String,
    require: true,
  },
  genre: [
    {
      type: String,
    },
  ],
  gender: {
    type: String,
  },
  liked: [
    {
      type: String,
    },
  ],
  later: [
    {
      type: String,
    },
  ],
  history: [
    {
      type: String,
      unique: true,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);

var mongoose = require("mongoose");
// use consistent naming either using string or classes
const BookSchema = mongoose.Schema({
  ISBN: {
    type: String,
    require: true,
    unique: true,
  },
  Publisher: {
    type: String,
    require: true,
  },
  catogery: {
    type: String,
  },
  Numberoflike: {
    type: String,
  },
  "Book-Author": {
    type: String,
  },
  "Year-Of-Publication": {
    type: String,
  },
  "Book-Title": {
    type: String,
  },
  "Image-URL-L": {
    type: String,
  },
});
module.exports = mongoose.model("Book", BookSchema);

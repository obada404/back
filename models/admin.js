var mongoose = require('mongoose');
const book = require('../models/Book');

const adminSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true,
      },
  Password: {
    type: String,
    require: true,
    unique: true

  },
  
  DoB: {
    type: String,
    require: true,
  }
})

module.exports = mongoose.model('User', UserSchema)
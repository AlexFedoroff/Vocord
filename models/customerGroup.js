const mongoose = require('mongoose');

const customerGroupSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 64,
    unique: true,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('customerGroup', customerGroupSchema);

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 64,
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

module.exports = mongoose.model('role', roleSchema);

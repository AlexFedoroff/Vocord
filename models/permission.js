const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 64,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('permission', permissionSchema);

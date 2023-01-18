const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 64,
    required: true,
    unique: [true, 'Такая роль уже существует'],
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'permission',
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('role', roleSchema);

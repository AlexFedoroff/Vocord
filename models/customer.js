const mongoose = require('mongoose');
const { isEmail } = require('validator');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  midName: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректный email',
    },
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    minlength: 8,
    maxlength: 16,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'customerGroup',
  }],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('customer', customerSchema);

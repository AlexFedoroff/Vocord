// const { string } = require('joi');
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 128,
  },
  message: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  customerGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'customerGroup',
  }],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
  },
  deliveryStatus: {
    type: String,
    default: 'project',
  },
});

module.exports = mongoose.model('notification', notificationSchema);

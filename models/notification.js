const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
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
  deliveryStatuses: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'customer',
  }],
});

module.exports = mongoose.model('notification', notificationSchema);

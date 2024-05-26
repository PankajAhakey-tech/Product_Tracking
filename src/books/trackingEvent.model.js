// models/TrackingEvent.js
const mongoose = require('mongoose');

const trackingEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['created', 'in transit', 'delivered'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }
});

const TrackingEvent = mongoose.model('TrackingEvent', trackingEventSchema);

module.exports = {TrackingEvent};

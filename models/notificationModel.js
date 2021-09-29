const mongoose = require('mongoose')


const notificationSchema = mongoose.Schema({
  to: {
    type: String,
  },
  type: {
    type: String,
    trim: true
  },
  onWhatId: {
    type: String,
    trim: true
  },
  onWhatNotification: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, "Please enter your description!"],
    trim: true
  },
  wasseen: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});



module.exports = mongoose.model("Notification", notificationSchema)
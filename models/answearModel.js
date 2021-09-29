const mongoose = require('mongoose')


const answearSchema = mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  description: {
    type: String,
    required: [true, "Please enter your description!"],
    trim: true
  },
  isanswear: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    default: []
  },
  likes: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});


module.exports = mongoose.model("Answear", answearSchema)
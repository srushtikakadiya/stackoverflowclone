const mongoose = require('mongoose')


const commentSchema = mongoose.Schema({
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
  }
}, {
  timestamps: true
});


module.exports = mongoose.model("Comment", commentSchema)
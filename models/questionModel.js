const mongoose = require('mongoose')


const questionSchema = mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  title: {
    type: String,
    required: [true, "Please enter your title!"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Please enter your description!"],
    trim: true
  },
  tags: {
    type: Array,
    default: [],
    validate: [tagsLimit, 'limit 10']
  },
  images: {
    type: Array,
    default: []
  },
  likes: {
    type: Array,
    default: [],
  },
  answered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

function tagsLimit(val) {
  return val.length <= 10;
}


module.exports = mongoose.model("Question", questionSchema)
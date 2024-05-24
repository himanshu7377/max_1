const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Array of Comment references
  likes: { type: Number, default: 0 ,min: 0}
}, { timestamps: true });



module.exports = mongoose.model('BlogPost', blogPostSchema);

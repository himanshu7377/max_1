const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Added role field with default value 'user'
  blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }], // Reference to BlogPost model
});

module.exports = mongoose.model('User', userSchema);

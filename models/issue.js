
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  upvotes: { type: Number, default: 0 },
 location: {
    lat: Number,
    lng: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', issueSchema);

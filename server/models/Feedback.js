const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional if anonymous
  isAnonymous: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ['Bug', 'Feature', 'UI/UX', 'Performance', 'Suggestion'],
    required: true
  },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  fileUrl: { type: String }, // optional: store file name or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

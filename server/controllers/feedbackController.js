const Feedback = require('../models/Feedback');
const { Parser } = require('json2csv');
const { sendFeedbackEmail } = require('../utils/mailer');

exports.submitFeedback = async (req, res) => {
  try {
    const { category, message, rating } = req.body;
    const isAnonymous = req.body.isAnonymous === 'true';
    const fileUrl = req.file ? req.file.filename : null;

    const feedback = new Feedback({
      user: isAnonymous ? null : req.user.id,
      category,
      message,
      rating,
      isAnonymous,
      fileUrl
    });

    await feedback.save();

    // ✅ Send immediate response
    res.status(201).json({ message: "Feedback submitted successfully!" });

    // ✅ Now send email in background (non-blocking)
    if (!isAnonymous && req.user?.email) {
      const plainText = `Hi ${req.user.name},\n\nWe received your feedback on "${category}".\n\nThank you!\n— Feedback Team`;

const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #4CAF50;">Thank you for your feedback, ${req.user.name}!</h2>
    <p>We have successfully received your feedback on:</p>
    <p><strong>Category:</strong> ${category}</p>
    <p style="margin-top: 16px;">We appreciate your input and value your time.</p>
    <br>
    <p>— The Feedback Team</p>
  </div>
`;

sendFeedbackEmail(
  req.user.email,
  'Thank you for your feedback!',
  plainText,
  htmlContent
)
      .then(() => console.log(`✅ Email sent to ${req.user.email}`))
      .catch((emailError) => console.error('❌ Email error:', emailError.message));
    }

  } catch (err) {
    console.error('❌ Feedback error:', err.message);
    res.status(500).json({ message: err.message });
  }
};




exports.getAllFeedback = async (req, res) => {
  try {
    const { category, minRating, maxRating } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = parseInt(minRating);
      if (maxRating) filter.rating.$lte = parseInt(maxRating);
    }

    const feedbacks = await Feedback.find(filter).populate('user', 'name email role');
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.exportFeedbackCSV = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'name email');

    const fields = ['_id', 'category', 'message', 'rating', 'isAnonymous', 'createdAt', 'user.name', 'user.email'];
    const parser = new Parser({ fields });
    const csv = parser.parse(feedbacks);

    res.header('Content-Type', 'text/csv');
    res.attachment('feedbacks.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getSummary = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);

    const categoryStats = await Feedback.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalFeedbacks: total,
      averageRating: avgRating[0]?.average.toFixed(2) || 0,
      categoryBreakdown: categoryStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

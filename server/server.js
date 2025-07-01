const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(express.json()); 
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/api/feedback', require('./routes/feedback'));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB error: ", err));

app.get('/', (req, res) => res.send("API is running..."));


const rateLimit = require('express-rate-limit');

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many feedbacks submitted. Please try again later.'
});

app.use('/api/feedback/submit', feedbackLimiter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

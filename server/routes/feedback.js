const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const verifyToken = require('../middleware/verifyToken');
const { submitFeedback } = require('../controllers/feedbackController');

router.post('/submit', verifyToken, upload.single('file'), submitFeedback);


const { getAllFeedback } = require('../controllers/feedbackController');
const isAdmin = require('../middleware/isAdmin');


router.get('/all', verifyToken, isAdmin, getAllFeedback);

const { deleteFeedback } = require('../controllers/feedbackController');

router.delete('/:id', verifyToken, isAdmin, deleteFeedback);

const { exportFeedbackCSV } = require('../controllers/feedbackController');

router.get('/export/csv', verifyToken, isAdmin, exportFeedbackCSV);

const { getSummary } = require('../controllers/feedbackController');
router.get('/summary', verifyToken, isAdmin, getSummary);


module.exports = router;

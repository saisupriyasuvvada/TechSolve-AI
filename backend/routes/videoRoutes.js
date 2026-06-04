const express = require('express');
const router = express.Router();

const { getTranscriptController } = require('../controllers/videoController');

router.post('/transcript', getTranscriptController);

module.exports = router;

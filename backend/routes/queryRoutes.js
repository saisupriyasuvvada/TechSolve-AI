const express = require('express');
const router = express.Router();

console.log("Query Routes Loaded");

router.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: "Query Routes are working!"
    });
});

const { askQuestionController } = require('../controllers/queryController');

router.post('/ask', askQuestionController); 

module.exports = router;
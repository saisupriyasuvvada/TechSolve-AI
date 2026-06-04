const express = require("express");

const router = express.Router();

const {
    analyzeController
} = require("../controllers/analysisController");

router.post(
    "/",
    analyzeController
);

module.exports = router;
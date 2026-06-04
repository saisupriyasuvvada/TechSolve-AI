const express = require("express");
const router = express.Router();

const { getInstagramTranscript } = require("../services/instagramService");

router.post("/test", async (req, res) => {
    try {
        const result = await getInstagramTranscript(req.body.url);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
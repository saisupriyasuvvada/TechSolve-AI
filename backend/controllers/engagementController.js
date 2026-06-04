const {
    analyzeEngagement
} = require(
    "../services/engagementService"
);

async function engagementController(
    req,
    res
) {

    try {

        const {
            metadata,
            transcript
        } = req.body;

        if (!transcript) {

            return res.status(400).json({
                success: false,
                message:
                    "Transcript is required"
            });
        }

        const analysis =
            await analyzeEngagement(
                metadata || {},
                transcript
            );

        return res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {

        console.error(
            "Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to analyze engagement"
        });
    }
}

module.exports = {
    engagementController
};
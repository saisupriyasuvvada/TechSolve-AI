const {
    compareVideos
} = require(
    "../services/compareService"
);

const {
    getYoutubeTranscript
} = require(
    "../services/youtubeService"
);

const {
    getInstagramTranscript
} = require(
    "../services/instagramService"
);

const {
    analyzeContent
} = require(
    "../services/analysisService"
);

async function compareController(
    req,
    res
) {

    try {

        const {
            youtubeUrl,
            instagramUrl
        } = req.body;

        if (
            !youtubeUrl ||
            !instagramUrl
        ) {
            return res.status(400).json({
                success:false,
                message:
                "Both URLs required"
            });
        }

        // Youtube

        const youtubeData =
        await getYoutubeTranscript(
            youtubeUrl
        );

        const youtubeAnalysis =
        await analyzeContent(
            youtubeData.transcript
        );

        // Instagram

        const instagramData =
        await getInstagramTranscript(
            instagramUrl
        );

        const instagramAnalysis =
        await analyzeContent(
            instagramData.englishTranscript
        );

        // Compare

        const comparison =
        await compareVideos(
            youtubeAnalysis.summary,
            instagramAnalysis.summary
        );

        return res.json({

            success:true,

            youtube:
            youtubeAnalysis,

            instagram:
            instagramAnalysis,

            comparison

        });

    } catch(error) {

        console.error(error);

        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {
    compareController
};
const { generateEmbedding } =
require("../services/embeddingService");

const { searchChunks } =
require("../services/chromaService");

const { generateAnswer } =
require("../services/aiService");

async function askQuestionController(
    req,
    res
) {
    try {

        const {
            question,
            platform,
            videoId,
            reelId
        } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        console.log("Question:", question);

        const queryEmbedding =
            await generateEmbedding(question);

        const contentId =
            videoId || reelId;

        const results =
            await searchChunks(
                queryEmbedding,
                platform
            );

        console.log(
            "Search Results:",
            JSON.stringify(results, null, 2)
        );

        if (
            !results.documents ||
            !results.documents[0] ||
            results.documents[0].length === 0
        ) {
            return res.status(404).json({
                success: false,
                message: "No matching content found"
            });
        }

        let context = "";

for (
  let i = 0;
  i < results.documents[0].length;
  i++
) {

  const doc =
    results.documents[0][i];

  const meta =
    results.metadatas[0][i];

  context += `
Platform: ${meta.platform}
Title: ${meta.title}
Creator: ${meta.creator}
Views: ${meta.views}
Likes: ${meta.likes}
Comments: ${meta.comments}
Engagement Rate: ${meta.engagementRate}

Transcript:
${doc}

====================
`;
}

        console.log(
            "Retrieved Context:",
            context
        );

        const answer =
            await generateAnswer(
                question,
                context
            );

        return res.status(200).json({
            success: true,
            answer
        });

    } catch (error) {

        console.error(
            "Ask Question Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "An error occurred while processing your question"
        });
    }
}

module.exports = {
    askQuestionController
};
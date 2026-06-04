const { getYoutubeTranscript } =
    require("../services/youtubeService");

const { getInstagramTranscript } =
    require("../services/instagramService");

const { translateToEnglish } =
    require("../services/translationService");

const { analyzeContent } =
    require("../services/analysisService");

const { RecursiveCharacterTextSplitter } =
require("@langchain/textsplitters");

const {
  generateEmbedding
} = require("../services/embeddingService");

const {
  storeChunks
} = require("../services/chromaService");

async function analyzeController(req, res) {

    try {

        const { url } = req.body;

        if (!url) {

            return res.status(400).json({
                success: false,
                message: "URL is required"
            });

        }

        let transcriptData;
        let englishTranscript;
        let platform;

        console.log("Getting transcript...");

        // =========================
        // YOUTUBE
        // =========================

        if (
            url.includes("youtube.com") ||
            url.includes("youtu.be")
        ) {

            platform = "YouTube";

            transcriptData =
                await getYoutubeTranscript(url);

            const { getYoutubeMetadata} = require("../services/youtubeService");

            const metadata = await getYoutubeMetadata(transcriptData.videoId);

            transcriptData = {
  ...transcriptData,
  ...metadata
};

            console.log( 
                "Translating transcript..."
            );

            try {

                englishTranscript = transcriptData.transcript;

            } catch (error) {

                console.log(
                    "Translation Failed. Using Original Transcript."
                );

                englishTranscript =
                    transcriptData.transcript;

            }

        }

        // =========================
        // INSTAGRAM
        // =========================

        else if (
            url.includes("instagram.com/reel")
        ) {

            platform = "Instagram";

            transcriptData =
    await getInstagramTranscript(url);

    console.log("Instagram Full Data");
console.log(transcriptData);

console.log(
  "Instagram Metadata:",
  {
    likes: transcriptData.likes,
    comments: transcriptData.comments,
    views: transcriptData.views
  }
);

            englishTranscript =
                transcriptData.englishTranscript ||
                transcriptData.transcript;

        }

        // =========================
        // INVALID URL
        // =========================

        else {

            return res.status(400).json({
                success: false,
                message:
                    "Only YouTube and Instagram Reel URLs are supported"
            });

        }

        const splitter =
  new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100
  });


  console.log(
  "Metadata Going To Chroma:",
  {
    title: transcriptData.title,
    creator: transcriptData.creator,
    views: transcriptData.views,
    likes: transcriptData.likes,
    comments: transcriptData.comments,
    engagementRate:
      transcriptData.engagementRate
  }
);

const chunks =
  await splitter.createDocuments(
    [englishTranscript],
    [
      {
        videoId:
          transcriptData.videoId || null,

        reelId:
          transcriptData.reelId || null,

        title:
          transcriptData.title || "",

        creator:
          transcriptData.creator || "",

        views:
          transcriptData.views || 0,

        likes:
          transcriptData.likes || 0,

        comments:
          transcriptData.comments || 0,

        engagementRate:
          transcriptData.engagementRate || 0,

        platform
      }
    ]
  );

const embeddings = [];

for (const chunk of chunks) {

  const embedding =
    await generateEmbedding(
      chunk.pageContent
    );

  embeddings.push(
    embedding
  );
}

console.log(
  "Before Chroma Store"
);

await storeChunks(
  chunks,
  embeddings
);

console.log(
  "After Chroma Store"
);
        console.log(
            "Analyzing content..."
        );

        const shortTranscript =
            englishTranscript.slice(
                0,
                5000
            );

        let analysis;

        try {

            analysis =
                await analyzeContent(
                    shortTranscript
                );

        } catch (error) {

            console.log(
                "Analysis Failed. Returning Fallback Response."
            );

            analysis = {

                summary:
                    "Gemini quota exceeded. Analysis unavailable.",

                sentiment:
                    "Unknown",

                topics: [],

                keyInsights: []

            };

        }

        const metadata =
  transcriptData.metadata || {};

        return res.status(200).json({
 
            success: true,

            platform,

            ...(transcriptData.videoId && {
                videoId:
                    transcriptData.videoId
            }),

            ...(transcriptData.reelId && {
                reelId:
                    transcriptData.reelId
            }),

            transcript:
                transcriptData.transcript,

            englishTranscript,

            ...analysis

        });

    }

    catch (error) {

        console.error(
            "Analysis Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}

module.exports = {
    analyzeController
};
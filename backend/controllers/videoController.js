const { getYoutubeTranscript, getYoutubeMetadata } = require("../services/youtubeService");
const { translateToEnglish } = require("../services/translationService");
const { chunkTranscript } = require("../services/chunkService");
const { generateEmbedding } = require("../services/embeddingService");
const { storeChunks } = require("../services/chromaService");

async function getTranscriptController(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    const result = await getYoutubeTranscript(url);
    // console.log("Transcript Result:", result);

    const metadata = await getYoutubeMetadata(result.videoId);
    // console.log("Metadata Result:", metadata);

    const englishTranscript = await translateToEnglish(result.transcript);
    console.log("English Transcript:", englishTranscript.slice(0, 200) );

    const chunks = await chunkTranscript(englishTranscript, {
      videoId: result.videoId,
      title: metadata.title,
      creator: metadata.creator,
      engagementRate: metadata.engagementRate,
      platform: "Youtube"
    });

    console.log("Chunks Created:", chunks.length);
    console.log("Sample Chunk:", chunks[0]);

    // const embedding = await generateEmbedding(
    //   chunks[0].pageContent
    // );
    // console.log("Embedding Generated:", embedding.length);

    const embeddings = [];

    for(const chunk of chunks){
      const embedding = await generateEmbedding(chunk.pageContent);
      embeddings.push(embedding);
    }

    console.log("All Embeddings Generated:", embeddings.length);

    await storeChunks(chunks, embeddings);
    console.log("Chunks Stored in ChromaDB");
    
    return res.status(200).json({
      success: true,
      videoId: result.videoId,
      transcript: result.transcript,
      englishTranscript: englishTranscript,
      metadata:{
        title: metadata.title,
        creator: metadata.creator,
        uploadDate: metadata.uploadDate,
        duration: metadata.duration,
        views: metadata.views,
        likes: metadata.likes,
        comments: metadata.comments,
        engagementRate: metadata.engagementRate
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}




module.exports = {
  getTranscriptController,
};
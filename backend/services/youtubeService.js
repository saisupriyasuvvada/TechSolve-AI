const { YoutubeTranscript } = require("youtube-transcript");

function extractVideoId(url) {
  try {
    const parsedUrl = new URL(url);

    // Shorts
    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/shorts/")[1];
    }

    // youtu.be
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }

    // watch?v=
    return parsedUrl.searchParams.get("v");
  } catch (error) {
    return null;
  }
}

async function fetchTranscript(videoId) {
  try {
    const transcriptData =
      await YoutubeTranscript.fetchTranscript(videoId);

    return transcriptData;
  } catch (error) {
    console.error("Transcript Error:", error.message);

    throw new Error(
      "Transcript not available for this video"
    );
  }
}

function cleanTranscript(transcriptData) {
  return transcriptData
    .map(item => item.text)
    .join(" ");
}

async function getYoutubeTranscript(url) {

  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  console.log("Video ID:", videoId);

  const transcriptData =
    await fetchTranscript(videoId);

  const transcript =
    cleanTranscript(transcriptData);

  const metadata =
    await getYoutubeMetadata(videoId);

  return {
    success: true,
    platform: "YouTube",
    videoId,
    transcript,

    metadata: {
      title: metadata.title,
      creator: metadata.creator,
      views: metadata.views,
      likes: metadata.likes,
      comments: metadata.comments,
      engagementRate: metadata.engagementRate
    }
  };
}


const { google } = require("googleapis");

async function getYoutubeMetadata(videoId) {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    // console.log("API KEY:", process.env.YOUTUBE_API_KEY);
    // console.log("VIDEO ID:", videoId);

    const response = await youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [videoId],
    });

    // console.log(
    //     JSON.stringify(response.data, null, 2)
    // );
    const video = response.data.items[0];

    if (!video) {
      throw new Error("Video not found");
    }

    const views = Number(video.statistics.viewCount || 0);
    const likes = Number(video.statistics.likeCount || 0);
    const comments = Number(video.statistics.commentCount || 0);

    const engagementRate =
      views > 0
        ? (((likes + comments) / views) * 100).toFixed(2)
        : 0;

    return {
      title: video.snippet.title,
      creator: video.snippet.channelTitle,
      uploadDate: video.snippet.publishedAt,
      description: video.snippet.description,
      thumbnails: video.snippet.thumbnails,
      views,
      likes,
      comments,
      duration: video.contentDetails.duration,
      engagementRate,
    };
  } catch (error) {
    console.error("Metadata Error:", error);
    throw new Error("Failed to fetch metadata");
  }
}

module.exports = {
  extractVideoId,
  fetchTranscript,
  cleanTranscript,
  getYoutubeTranscript,
  getYoutubeMetadata
};
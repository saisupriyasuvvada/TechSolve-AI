const { GoogleGenerativeAI } =
require("@google/generative-ai");

const genAI =
new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

async function compareVideos(
youtubeSummary,
instagramSummary
) {

    const model =
    genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = `
Compare these two videos.

Video 1:
${youtubeSummary}

Video 2:
${instagramSummary}

Return ONLY valid JSON.

{
  "winner":"",
  "reason":"",
  "comparison":"",
  "suggestions":[]
}
`;

    const result =
    await model.generateContent(
        prompt
    );

    const response =
    result.response.text();

    const cleaned =
    response
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();

    return JSON.parse(cleaned);
}

module.exports = {
    compareVideos
};
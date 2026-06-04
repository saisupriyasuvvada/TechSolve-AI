const { GoogleGenerativeAI } =
require("@google/generative-ai");

const genAI =
new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

async function analyzeEngagement(
    metadata,
    transcript
) {

    try {

        const model =
            genAI.getGenerativeModel({
                model: "gemini-2.5-flash"
            });

        const prompt = `
Analyze this social media content.

Transcript:
${transcript}

Return ONLY valid JSON:

{
  "contentCategory":"",
  "targetAudience":"",
  "engagementLevel":"",
  "viralPotential":"",
  "strengths":[],
  "weaknesses":[],
  "suggestions":[]
}
`;

        const result =
            await model.generateContent(
                prompt
            );

        const response =
            result.response.text();

        console.log(
            "Gemini Response:",
            response
        );

        const cleanedResponse =
            response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        return JSON.parse(
            cleanedResponse
        );

    } catch (error) {

        console.error(
            "Engagement Analysis Error:",
            error.message
        );

        // Fallback result
        
    return {
      contentCategory: "General Content",
      targetAudience: "General Audience",
      engagementLevel: "Medium",
      viralPotential: "Medium",
      strengths: [
        "Transcript available"
      ],
      weaknesses: [
        "AI quota exceeded"
      ],
      suggestions: [
        "Retry tomorrow"
      ]
    };
    }
}

module.exports = {
    analyzeEngagement
};
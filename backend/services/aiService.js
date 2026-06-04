const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

async function generateAnswer(
    question,
    context
) {
    try {

        const model =
            genAI.getGenerativeModel({
                model: "gemini-2.5-flash"
            });


            const prompt = `
You are a social media content analyst.

Answer briefly.

Rules:

- Maximum 5 lines.
- Do not repeat transcript.
- Do not show raw metadata.
- Give direct answer only.

Examples:

Question:
Which video is better?

Answer:
The YouTube video is better because it has stronger storytelling and higher engagement metrics.

Question:
How can the YouTube video improve?

Answer:
Add a stronger hook, faster pacing, and a clearer call-to-action.

Context:
${context}

Question:
${question}

Answer:
`;

        const result =
            await model.generateContent(
                prompt
            );

        return result.response.text();

    } catch (error) {

        console.error(
            "Generative AI Error:",
            error
        );

        // Gemini quota exceeded
       if (error.status === 429) {

    return `
Gemini quota exceeded.

Please try again tomorrow
or use a new Gemini API key.
`;
}
        // Gemini temporarily unavailable
        if (error.status === 503) {
  return "AI service temporarily unavailable. Please try again later.";
}

        throw error;
    }
}

module.exports = {
    generateAnswer
};
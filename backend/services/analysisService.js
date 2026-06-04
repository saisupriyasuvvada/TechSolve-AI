const { GoogleGenerativeAI } =
    require("@google/generative-ai");

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

async function analyzeContent(transcript) {

    try {

        const model =
            genAI.getGenerativeModel({
                model: "gemini-2.5-flash"
            });

        const prompt = `
Analyze the following content.

Return ONLY valid JSON.

{
  "summary":"",
  "sentiment":"",
  "topics":[],
  "keyInsights":[]
}

Content:
${transcript}
`;

        console.log(
            "Sending transcript to Gemini..."
        );

        let result;

for (let i = 0; i < 3; i++) {
    try {

        result =
            await model.generateContent(prompt);

        break;

    } catch (error) {

        if (i === 2) throw error;

        console.log(
            `Gemini retry ${i + 1}`
        );

        await new Promise(resolve =>
            setTimeout(resolve, 5000)
        );
    }
}

        console.log(
            "Gemini response received"
        );

        const response =
            result.response.text();

        console.log(
            "Raw Gemini Response:",
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
            "Gemini Analysis Error:"
        );

        console.error(error); 

        return {
            summary: transcript.substring(0, 200),
            sentiment: "Neutral",
            topics: ["General Conversation"],
            keyInsights: ["Gemini analysis unavailable"]
        };
    }
}

module.exports = {
    analyzeContent
};
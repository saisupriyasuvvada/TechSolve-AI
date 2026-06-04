const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

async function translateToEnglish(text) {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = `
Translate the following text into natural English.

Rules:
- Only return translated English text.
- Do not explain.
- Do not add notes.
- Preserve meaning.

Text:
${text}
`;

    let retries = 3;

    while (retries > 0) {

        try {

            const result =
                await model.generateContent(prompt);

            return result.response.text();

        } catch (error) {

            console.error(
                "Translation Error:",
                error.message
            );

            retries--;

            if (retries === 0) {
                throw error;
            }

            await new Promise(resolve =>
                setTimeout(resolve, 3000)
            );
        }
    }
}

module.exports = {
    translateToEnglish
};
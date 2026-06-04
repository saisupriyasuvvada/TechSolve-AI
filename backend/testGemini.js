// testGemini.js

require("dotenv").config();

const { GoogleGenerativeAI } =
require("@google/generative-ai");

console.log("API Key Loaded:",
    process.env.GEMINI_API_KEY
        ? process.env.GEMINI_API_KEY.slice(0, 10)
        : "NOT FOUND"
);

const genAI =
new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

async function test() {

    try {

        const model =
        genAI.getGenerativeModel({
             model: "gemini-2.0-flash-lite"
        });

        const result =
        await model.generateContent(
            "Say hello"
        );

        console.log(
            result.response.text()
        );

    } catch (err) {

        console.error(err);

    }
}

test();
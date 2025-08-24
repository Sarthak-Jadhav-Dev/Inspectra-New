const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.config(GEMINI_API_KEY));
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `Analyse the gihub repo and Provide a Brief Summary of Objective of the repo
`
});

async function generatePrompt(prompt) {
    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    return result.response.text();
}

module.exports = generatePrompt;

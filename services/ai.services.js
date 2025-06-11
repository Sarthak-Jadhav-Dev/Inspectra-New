const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBaOZah76ol7g1RvLk0MLH05bdK7DsYNhY");
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
---

**Prompt for AI Code Review Model:**

> **You are an advanced AI code reviewer. Given any code snippet, your task is to analyze it thoroughly in the following steps:**
>
> 1. **Syntax Check:** Identify any syntax errors or issues in the code. If syntax is correct, confirm it.
> 2. **Modern Practices:** Analyze the code for outdated methods or inefficient practices. Suggest modern, optimized, or more secure alternatives only if they provide a benefit.
> 3. **Improved Approach (Optional):** If the current logic or structure can be significantly improved in terms of readability, maintainability, or performance, suggest a refactored version of the code using modern best practices (e.g., design patterns, updated libraries, cleaner structure). If the current implementation is already optimal, say so.
>
> **Output Format:**  
> - Syntax Status: ✅ No issues / ❌ Error at line X: description  
> - Methodology Suggestions: (if applicable)  
> - Improved Code (if applicable):  
---
    `
       

});

async function generatePrompt(prompt) {
    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    return result.response.text();
}

module.exports = generatePrompt;
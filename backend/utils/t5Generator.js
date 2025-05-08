const axios = require("axios");

async function generate_quiz(inputText) {
  try {
    console.log("📤 Sending content to API...");
    const response = await axios.post("http://127.0.0.1:5005/generate-quiz", {
      content: inputText,
    });

    const quizData = response.data?.quiz || [];
    if (quizData.length > 0) {
      console.log("✅ Quiz received:", quizData);
      return quizData;
    } else {
      console.warn("⚠️ No quiz questions returned.");
      return [];
    }
  } catch (error) {
    console.error("❌ API Error:", error?.response?.data || error.message);
    throw new Error("Quiz generation failed.");
  }
}

module.exports = generate_quiz;

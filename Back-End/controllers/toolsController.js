const Groq = require("groq-sdk");
const config = require("../config");
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

class ToolsController {
  static async translateText(req, res) {
    try {
      const { text, targetLanguage } = req.body;

      if (!text || !targetLanguage) {
        return sendError(res, 400, "Text and Target Language are required");
      }

      const prompt = `
        You are a professional native translator. Translate the following text into ${targetLanguage}.
        Return ONLY the translated text, without any additional explanations, quotes, or comments.
        
        Text to translate:
        "${text}"
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1, // Sangat kaku agar terjemahan akurat
      });

      const translatedText = chatCompletion.choices[0].message.content.trim();
      return sendSuccess(res, 200, "Translation successful", { translatedText });

    } catch (error) {
      console.error("Translation Error:", error.message);
      return sendError(res, 500, "Failed to translate text.");
    }
  }
}

module.exports = ToolsController;
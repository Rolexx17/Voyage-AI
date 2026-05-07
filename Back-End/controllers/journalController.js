const Groq = require("groq-sdk");
const config = require("../config");
const JournalModel = require("../models/journalModel");
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

class JournalController {
  static async getJournals(req, res) {
    try {
      const journals = await JournalModel.findByUserId(req.user.id);
      return sendSuccess(res, 200, "Journals fetched", journals);
    } catch (error) {
      return sendError(res, 500, "Failed to fetch journals");
    }
  }

  static async addJournal(req, res) {
    try {
      const { title, location, story, rating, date } = req.body;
      const newJournal = await JournalModel.create(req.user.id, title, location, story, rating, date);
      return sendSuccess(res, 201, "Journal added", newJournal);
    } catch (error) {
      return sendError(res, 500, "Failed to add journal entry");
    }
  }

  static async deleteJournal(req, res) {
    try {
      const { id } = req.params;
      await JournalModel.delete(id, req.user.id);
      return sendSuccess(res, 200, "Journal deleted");
    } catch (error) {
      return sendError(res, 500, "Failed to delete journal");
    }
  }

  // FITUR AI ENHANCE WRITING
  static async enhanceStory(req, res) {
    try {
      const { rawText } = req.body;
      if (!rawText) return sendError(res, 400, "Raw text is required");

      const prompt = `
        You are a professional travel blogger. Enhance the following rough notes into a beautifully written, engaging, and aesthetic travel diary paragraph. 
        Keep it concise (max 3-4 sentences), emotive, and use good vocabulary. Only return the enhanced text, nothing else.
        Raw notes: "${rawText}"
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
      });

      const enhancedText = chatCompletion.choices[0].message.content.trim();
      return sendSuccess(res, 200, "Story enhanced", { enhancedText });
    } catch (error) {
      console.error("AI Enhance Error:", error.message);
      return sendError(res, 500, "Failed to enhance story");
    }
  }
}

module.exports = JournalController;
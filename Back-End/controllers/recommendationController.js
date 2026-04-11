const Groq = require("groq-sdk");
const config = require("../config");
const UserModel = require("../models/userModel");
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

class RecommendationController {
  static async getRecommendations(req, res) {
    try {
      const { category } = req.params; 
      const { location } = req.query; // Tangkap lokasi dari Frontend
      const userId = req.user.id;

      if (!location) return sendError(res, 400, "Location is required");

      const user = await UserModel.findById(userId);
      if (!user) return sendError(res, 404, "User not found in database");

      const interests = Array.isArray(user.interests) ? user.interests.join(", ") : (user.interests || "General");

      // Prompt Ultimate: Minta 10 data & Harga Angka
      const prompt = `
        ### SYSTEM ROLE
        You are an expert Local Travel Guide for ${location}.
        
        ### GOAL
        Provide EXACTLY 10 ${category} options physically located in ${location}.
        Filter based on the user's profile:
        - Style: ${user.style || 'Adventure'}
        - Budget: ${user.budget || 'Medium'}
        - Interests: ${interests}

        ### OUTPUT FORMAT (JSON ONLY)
        {
          "recommendations": [
            {
              "name": "Name of the place",
              "description": "Short description",
              "location": "District in ${location}",
              "price_estimate": "Show 'Free' or local price (e.g. Rp 50.000)",
              "price_usd_value": <NUMBER ONLY. Use 0 for Free spots. Do not use strings.>,
              "why_it_fits": "Reason"
            }
          ]
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You strictly provide 10 items. You never suggest places outside the requested city." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.1-8b-instant", // Model cerdas yang stabil
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const responseData = JSON.parse(chatCompletion.choices[0].message.content);
      return sendSuccess(res, 200, `Fetched ${category} in ${location}`, responseData.recommendations);

    } catch (error) {
      console.error("DETAILED ERROR:", error.message);
      return sendError(res, 500, "AI Service Error: " + error.message);
    }
  }
}

module.exports = RecommendationController;
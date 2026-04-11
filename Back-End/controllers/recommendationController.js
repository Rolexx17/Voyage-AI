const Groq = require("groq-sdk");
const config = require("../config");
const UserModel = require("../models/userModel");
const { sendSuccess, sendError } = require("../utils/responseFormat");

// Pastikan inisialisasi aman dari undefined
const groq = new Groq({ 
  apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY 
});

class RecommendationController {
  static async getRecommendations(req, res) {
    try {
      const { category } = req.params; 
      const userId = req.user.id;

      // 1. Ambil preferensi user
      const user = await UserModel.findById(userId);
      if (!user) return sendError(res, 404, "User not found in database");

      // 2. Format interests agar tidak error .join()
      const interests = Array.isArray(user.interests) 
        ? user.interests.join(", ") 
        : (user.interests || "General Travel");

      // 3. Siapkan Prompt untuk Llama 3
      const prompt = `
        You are a local travel expert. Suggest 4 ${category} for a traveler with these preferences:
        Style: ${user.style || 'Adventure'}, Budget: ${user.budget || 'Medium'}, 
        Food: ${user.food || 'Any'}, Travel Type: ${user.travel_type || 'Solo'}, 
        Interests: ${interests}.
        Respond strictly in JSON format:
        {
          "recommendations": [
            {
              "name": "Name",
              "description": "Short description",
              "location": "City",
              "price_estimate": "Cost",
              "why_it_fits": "Reason"
            }
          ]
        }
      `;

      // 4. Panggil Groq AI
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
      });

      const responseData = JSON.parse(chatCompletion.choices[0].message.content);
      return sendSuccess(res, 200, `Fetched ${category}`, responseData.recommendations);

    } catch (error) {
      // LIHAT TERMINAL BACKEND UNTUK DETAIL ERROR INI
      console.error("DETAILED ERROR:", error.message);
      return sendError(res, 500, "AI Service Error: " + error.message);
    }
  }
}

module.exports = RecommendationController;
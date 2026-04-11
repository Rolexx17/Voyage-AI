const Groq = require("groq-sdk");
const config = require("../config");
const UserModel = require("../models/userModel");
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ 
  apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY 
});

class RecommendationController {
  static async getRecommendations(req, res) {
    try {
      const { category } = req.params; 
      const { location } = req.query; 
      const userId = req.user.id;

      if (!location) return sendError(res, 400, "Location is required");

      const user = await UserModel.findById(userId);
      if (!user) return sendError(res, 404, "User not found in database");

      const interests = Array.isArray(user.interests) 
        ? user.interests.join(", ") 
        : (user.interests || "General Travel");

      const prompt = `
        ### SYSTEM ROLE
        You are a highly accurate Local Travel Guide and Trend-Spotter physically based in ${location}. 
        Your knowledge is updated for 2024-2026.

        ### STRICT LOCATION CONSTRAINT
        - TARGET LOCATION: ${location}
        - MANDATORY RULE: Every single recommendation MUST be available or located within ${location}.
        - DOUBLE-CHECK: Do not suggest options that don't exist in ${location}.

        ### HYPED & PERSONALIZED GOAL
        Find 4 ${category} options that are highly recommended, practical, or currently trending in 2024-2025.
        Filter these based on the user's profile:
        - Style: ${user.style || 'Adventure'}
        - Budget: ${user.budget || 'Medium'}

        ### OUTPUT FORMAT (JSON ONLY)
        {
          "recommendations": [
            {
              "name": "Exact Name of the ${category} in ${location} (e.g., Gojek, MRT Jakarta, Local Scooter Rental)",
              "description": "Why it is the best/trendiest choice right now",
              "location": "Coverage area or main hub in ${location}",
              "price_estimate": "Current price estimate in local currency",
              "why_it_fits": "Why it fits their ${user.style} travel style and budget"
            }
          ]
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a precise geographical filter. You never suggest places/services outside the requested city." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile", // Model stabil
        temperature: 0.2, // Akurasi tinggi
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
const Groq = require("groq-sdk");
const config = require("../config");
const UserModel = require("../models/userModel");
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

class DashboardController {
  static async getInsights(req, res) {
    try {
      const { lat, lng } = req.query;
      const userId = req.user.id;
      
      // Ambil data user untuk personalisasi AI
      const user = await UserModel.findById(userId);
      if (!user) return sendError(res, 404, "User not found");

      let locationName = "Global Standard";
      
      if (lat && lng) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'User-Agent': 'VoyageAI-App' }
          });
          const geoData = await response.json();
          // Ambil nama kota/daerah yang paling spesifik
          locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state || geoData.address?.country || "Current Location";
        } catch (e) {
          console.warn("Geocoding failed");
        }
      }

      const prompt = `
        You are Voyage AI. The traveler ${user.name} is in ${locationName}. 
        Style: ${user.style || 'Adventure'}.
        Respond STRICTLY in JSON:
        {
          "greeting": "A short welcome in ${locationName}",
          "fun_fact": "One amazing fact about ${locationName}",
          "local_insight": "One cultural tip for ${locationName}",
          "daily_recommendation": "One specific activity in ${locationName} today"
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const insights = JSON.parse(chatCompletion.choices[0].message.content);
      
      return sendSuccess(res, 200, "Dashboard insights generated", {
        ...insights,
        locationDetected: locationName // Paksa kirim ulang variabel ini
      });

      return sendSuccess(res, 200, "Dashboard insights generated", insights);
    } catch (error) {
      console.error("Dashboard Error:", error.message);
      return sendError(res, 500, "Failed to generate dashboard insights");
    }
  }
}

module.exports = DashboardController;
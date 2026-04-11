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

      let locationName = "Current Location";
      
      // 1. Logika Geocoding (Cari Nama Lokasi Berdasarkan Koordinat)
      if (lat && lng) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'User-Agent': 'VoyageAI-App' }
          });
          const geoData = await response.json();
          locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state || "Current Location";
        } catch (e) {
          console.warn("Geocoding failed, using default name.");
        }
      }

      // 2. Prompt yang diperingkas (Irit Token)
      const prompt = `Respond STRICTLY in JSON for traveler ${user.name} in ${locationName}. Style: ${user.style || 'Adventure'}. Format: { "greeting": "Short hi", "fun_fact": "One fact", "local_insight": "One tip", "daily_recommendation": "One activity" }`;

      try {
        // 3. Panggil AI dengan model paling hemat (8b-instant)
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.1-8b-instant", 
          temperature: 0.7,
          max_tokens: 300, // Batasi panjang output agar irit kuota
          response_format: { type: "json_object" },
        });

        const insights = JSON.parse(chatCompletion.choices[0].message.content);
        
        return sendSuccess(res, 200, "Dashboard insights generated", {
          ...insights,
          locationDetected: locationName
        });

      } catch (aiError) {
        // 4. Logika Fallback jika Groq Rate Limit (Error 429)
        console.warn("AI Limit Reached or Error. Sending fallback data to prevent crash.");
        
        return sendSuccess(res, 200, "Fallback data sent", {
          greeting: `Hello, ${user.name}!`,
          fun_fact: "Traveling can significantly reduce stress and improve mental health.",
          local_insight: "Always keep a digital copy of your passport and respect local traditions.",
          daily_recommendation: "Explore a hidden gem nearby or try a local street food today.",
          locationDetected: locationName
        });
      }
    } catch (error) {
      console.error("Critical Dashboard Error:", error.message);
      return sendError(res, 500, "Failed to generate dashboard insights");
    }
  }
}

module.exports = DashboardController;
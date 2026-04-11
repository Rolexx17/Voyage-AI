const { sendSuccess, sendError } = require('../utils/responseFormat');
const Groq = require("groq-sdk");
const config = require("../config");

// Inisialisasi Groq
const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

const emergencyDirectory = {
  "id": { country: "Indonesia", police: "110", medical: "119", fire: "113" },
  "us": { country: "United States", police: "911", medical: "911", fire: "911" },
  "jp": { country: "Japan", police: "110", medical: "119", fire: "119" },
  "gb": { country: "United Kingdom", police: "999", medical: "999", fire: "999" },
  "au": { country: "Australia", police: "000", medical: "000", fire: "000" },
  "sg": { country: "Singapore", police: "999", medical: "995", fire: "995" },
  "my": { country: "Malaysia", police: "999", medical: "999", fire: "994" },
  "kr": { country: "South Korea", police: "112", medical: "119", fire: "119" },
  "default": { country: "Global/Unknown", police: "112", medical: "112", fire: "112" }
};

class EmergencyController {
  static async getLocalNumbers(req, res) {
    try {
      const { lat, lng } = req.query;

      // Default data jika GPS mati
      if (!lat || !lng) {
        return sendSuccess(res, 200, "Using default", {
          ...emergencyDirectory.default,
          region: "Global",
          hospital: { name: "Local General Hospital", info: "Please search 'Hospital' on Google Maps for real-time nearest results." }
        });
      }

      // 1. Geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'User-Agent': 'VoyageAI-App' }
      });
      const geoData = await response.json();
      const countryCode = geoData.address?.country_code?.toLowerCase() || 'default';
      const localNumbers = JSON.parse(JSON.stringify(emergencyDirectory[countryCode] || emergencyDirectory.default));
      const region = geoData.address?.city || geoData.address?.state || localNumbers.country;
      localNumbers.region = region;

      // 2. AI Hospital Search dengan Protection
      let hospitalData = { name: "Regional General Hospital", info: "Major medical facility in this region." };
      
      try {
        const prompt = `Region: ${region}, ${localNumbers.country}. One major General Hospital name & short info. JSON: { "name": "...", "info": "..." }`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.1-8b-instant",
          temperature: 0.1,
          max_tokens: 150, // Sangat sedikit agar hemat
          response_format: { type: "json_object" },
        });

        hospitalData = JSON.parse(chatCompletion.choices[0].message.content);
      } catch (aiError) {
        console.warn("AI Hospital search failed/limit reached. Using default.");
      }

      return sendSuccess(res, 200, "Local data fetched", {
        ...localNumbers,
        hospital: hospitalData
      });

    } catch (error) {
      return sendSuccess(res, 200, "Fallback", emergencyDirectory.default);
    }
  }
}

module.exports = EmergencyController;
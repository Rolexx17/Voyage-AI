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

      if (!lat || !lng) {
        return sendSuccess(res, 200, "Using default", {
          ...emergencyDirectory.default,
          hospital: { name: "Nearest Hospital", info: "Search on Maps" }
        });
      }

      // 1. Dapatkan Nama Kota & Negara dari Koordinat GPS
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'User-Agent': 'VoyageAI-App' }
      });
      const geoData = await response.json();

      const countryCode = geoData.address?.country_code?.toLowerCase() || 'default';
      const localNumbers = emergencyDirectory[countryCode] || emergencyDirectory.default;
      const region = geoData.address?.city || geoData.address?.state || localNumbers.country;
      localNumbers.region = region;

      // 2. Gunakan AI untuk mencari Rumah Sakit Utama di region tersebut
      let hospitalData = { name: "Central General Hospital", info: "Major medical facility in this area" };
      
      try {
        const prompt = `
          The user is currently located in ${region}, ${localNumbers.country}.
          Name ONE major, well-known General Hospital in or very close to this specific area.
          Respond STRICTLY in JSON format:
          {
            "name": "Exact Name of the Hospital",
            "info": "Short description (e.g., 'Major general hospital in the city center')"
          }
        `;

        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.1, // Sangat akurat
          response_format: { type: "json_object" },
        });

        hospitalData = JSON.parse(chatCompletion.choices[0].message.content);
      } catch (aiError) {
        console.error("AI Hospital Search Error:", aiError.message);
      }

      // Gabungkan data nomor darurat + data rumah sakit
      return sendSuccess(res, 200, "Local data fetched", {
        ...localNumbers,
        hospital: hospitalData
      });

    } catch (error) {
      console.error("Emergency Locator Error:", error);
      return sendSuccess(res, 200, "Fallback to default", emergencyDirectory.default);
    }
  }
}

module.exports = EmergencyController;
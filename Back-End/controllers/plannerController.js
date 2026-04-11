const Groq = require("groq-sdk");
const config = require("../config");
const UserModel = require("../models/userModel");
const ItineraryModel = require("../models/itineraryModel"); // Import Model PostgreSQL
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

class PlannerController {
  // MENGAMBIL HISTORY DARI DATABASE
  static async getHistory(req, res) {
    try {
      const history = await ItineraryModel.findByUserId(req.user.id);
      return sendSuccess(res, 200, "History fetched", history);
    } catch (error) {
      console.error("Fetch History Error:", error);
      return sendError(res, 500, "Failed to fetch history");
    }
  }

  // GENERATE DAN SIMPAN KE DATABASE
  static async generatePlan(req, res) {
    try {
      const { origin, destination, dates, budget, tripType, vibe } = req.body;
      const userId = req.user.id;
      
      const user = await UserModel.findById(userId); // Pastikan ini juga sudah support PostgreSQL
      const userStyle = user?.style || 'Adventure';

      if (!origin || !destination || !dates || !budget) {
        return sendError(res, 400, "Origin, destination, dates, and budget are required");
      }

      const prompt = `
        You are an elite travel financial planner and concierge for Voyage AI. 
        CRITICAL CONSTRAINT: The total cost MUST NOT EXCEED ${budget}.
        User Profile: Origin: ${origin}, Destination: ${destination}, Dates: ${dates}, Max Budget: ${budget}, Trip Type: ${tripType}, Vibe: ${vibe}, Style: ${userStyle}.

        Respond STRICTLY in this JSON format:
        {
          "summary": {
            "origin": "e.g., Jakarta (CGK)",
            "destination": "e.g., Tokyo (HND)",
            "duration": "e.g., 5 Days, 4 Nights",
            "total_budget_used": "e.g., $1,400",
            "weather": "e.g., 22°C, Mostly Sunny",
            "best_app_to_download": "e.g., Grab, Uber"
          },
          "logistics": {
            "flight": { "route": "...", "est_cost": "...", "tip": "..." },
            "hotel": { "name": "...", "area": "...", "price_per_night": "...", "why_stay_here": "..." },
            "transport": { "airport_transfer": "...", "daily_getting_around": "..." }
          },
          "packing_list": ["Item 1", "Item 2"],
          "itinerary": [
            {
              "day": "Day 1", "date": "...", "daily_theme": "...",
              "activities": [
                { "time": "...", "event": "...", "location": "...", "description": "...", "transport": "...", "cost": "...", "insider_tip": "..." }
              ]
            }
          ]
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        response_format: { type: "json_object" },
      });

      const plan = JSON.parse(chatCompletion.choices[0].message.content);

      // SIMPAN KE POSTGRESQL
      const newItinerary = await ItineraryModel.create(userId, plan);

      return sendSuccess(res, 200, "Travel plan generated and saved", newItinerary);
    } catch (error) {
      console.error("Planner Error:", error);
      return sendError(res, 500, "Failed to generate travel plan");
    }
  }
}

module.exports = PlannerController;
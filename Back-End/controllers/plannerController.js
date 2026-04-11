const Groq = require("groq-sdk");
const config = require("../config");
const UserModel = require("../models/userModel");
const ItineraryModel = require("../models/itineraryModel"); 
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

class PlannerController {
  // GET HISTORY DARI DATABASE
  static async getHistory(req, res) {
    try {
      const history = await ItineraryModel.findByUserId(req.user.id);
      return sendSuccess(res, 200, "History fetched", history);
    } catch (error) {
      console.error("Fetch History Error:", error);
      return sendError(res, 500, "Failed to fetch history");
    }
  }

  // GENERATE & SAVE KE DATABASE
  static async generatePlan(req, res) {
    try {
      const { origin, destination, dates, budget, tripType, vibe } = req.body;
      const userId = req.user.id;
      
      const user = await UserModel.findById(userId);
      const userStyle = user?.style || 'Adventure';

      if (!origin || !destination || !dates || !budget) {
        return sendError(res, 400, "Origin, destination, dates, and budget are required");
      }

      const prompt = `
        You are an elite travel concierge. Create a MASTER LEVEL travel itinerary.
        CRITICAL CONSTRAINT: Total cost MUST NOT EXCEED ${budget}.
        User Profile: Origin: ${origin}, Destination: ${destination}, Dates: ${dates}, Max Budget: ${budget}, Trip Type: ${tripType}, Vibe: ${vibe}, Style: ${userStyle}.

        Respond STRICTLY in this JSON format. Make all details highly realistic, specific, and exhaustive:
        {
          "summary": {
            "origin": "e.g., Jakarta (CGK)",
            "destination": "e.g., Tokyo (HND)",
            "duration": "e.g., 5 Days, 4 Nights",
            "total_budget_used": "e.g., $1,400 (Must be under ${budget})",
            "weather": "e.g., 18°C - 24°C, Crisp Autumn Air",
            "best_app_to_download": "e.g., Google Maps, Japan Official Travel App"
          },
          "logistics": {
            "flight": { 
              "airline": "e.g., Singapore Airlines (SQ)",
              "route": "e.g., CGK (10:00 AM) -> SIN (Layover 2h) -> HND (09:00 PM)", 
              "est_cost": "e.g., $450 Round Trip", 
              "baggage_info": "e.g., 30kg Checked Baggage Included",
              "tip": "e.g., Pick window seat on the left to see Mt. Fuji" 
            },
            "hotel": { 
              "name": "e.g., Shinjuku Granbell Hotel", 
              "room_type": "e.g., Standard Double City View",
              "area": "e.g., Kabukicho, Shinjuku (2 mins from station)", 
              "price_per_night": "e.g., $120/night", 
              "amenities": "e.g., Free WiFi, Rooftop Bar, Public Onsen",
              "why_stay_here": "e.g., Close to nightlife and main transport hubs." 
            },
            "transport": { 
              "airport_transfer": "e.g., Narita Express (N'EX), takes 1h 20m directly to Shinjuku, Costs $25", 
              "daily_getting_around": "e.g., Buy a 72-hour Tokyo Subway Ticket for unlimited rides ($11)" 
            }
          },
          "packing_list": ["Item 1 (reason)", "Item 2 (reason)"],
          "itinerary": [
            {
              "day": "Day 1", "date": "...", "daily_theme": "...",
              "activities": [
                { 
                  "time": "09:00 AM - 11:30 AM", 
                  "event": "e.g., Explore Senso-ji Temple", 
                  "location": "e.g., Asakusa", 
                  "description": "Deeply detailed explanation of what to do, what to look out for, and historical context.", 
                  "food_recommendation": "e.g., Eat at Daikokuya. Must order: Tendon (Tempura Rice Bowl). Est: $12",
                  "transport": "e.g., Take Ginza Line from Shinjuku to Asakusa (25 mins)", 
                  "cost": "e.g., Entrance Free + Food $12", 
                  "insider_tip": "e.g., Go to the left side of the main hall for a quiet photo spot." 
                }
              ]
            }
          ]
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        response_format: { type: "json_object" },
      });

      const plan = JSON.parse(chatCompletion.choices[0].message.content);

      // SIMPAN KE POSTGRESQL (Menggunakan Model yang sudah dibuat)
      const newItinerary = await ItineraryModel.create(userId, plan);

      return sendSuccess(res, 200, "Travel plan generated and saved", newItinerary);
    } catch (error) {
      console.error("Planner Error:", error);
      return sendError(res, 500, "Failed to generate travel plan");
    }

  }
  static async deletePlan(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deletedPlan = await ItineraryModel.delete(id, userId);
      
      if (!deletedPlan) {
        return sendError(res, 404, "Itinerary not found or unauthorized");
      }

      return sendSuccess(res, 200, "Itinerary deleted successfully", deletedPlan);
    } catch (error) {
      console.error("Delete Plan Error:", error);
      return sendError(res, 500, "Failed to delete itinerary");
    }
  }
}

module.exports = PlannerController;
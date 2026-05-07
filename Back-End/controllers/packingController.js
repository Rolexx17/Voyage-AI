const Groq = require("groq-sdk");
const config = require("../config");
const PackingModel = require("../models/packingModel");
const { sendSuccess, sendError } = require("../utils/responseFormat");

const groq = new Groq({ apiKey: config.ai?.groqApiKey || process.env.GROQ_API_KEY });

class PackingController {
  static async getLists(req, res) {
    try {
      const lists = await PackingModel.findByUserId(req.user.id);
      return sendSuccess(res, 200, "Packing lists fetched", lists);
    } catch (error) {
      return sendError(res, 500, "Failed to fetch packing lists");
    }
  }

  static async generateList(req, res) {
    try {
      const { destination, duration, vibe } = req.body;
      const userId = req.user.id;

      const prompt = `
        Create a practical, categorized packing list for a trip to ${destination} for ${duration} days. The vibe/season is ${vibe}.
        Respond STRICTLY in JSON format like this:
        {
          "title": "Packing for ${destination}",
          "categories": [
            {
              "name": "Clothing",
              "items": ["3x T-shirts", "1x Jacket"]
            },
            {
              "name": "Toiletries",
              "items": ["Toothbrush", "Sunscreen"]
            }
          ]
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.5,
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);
      
      // Transform AI response into our DB structure
      let flatItems = [];
      aiResponse.categories.forEach(cat => {
        cat.items.forEach(itemName => {
          flatItems.push({ id: Date.now().toString() + Math.random(), name: itemName, category: cat.name, isPacked: false });
        });
      });

      const newList = await PackingModel.create(userId, aiResponse.title, flatItems);
      return sendSuccess(res, 201, "Packing list generated", newList);
    } catch (error) {
      console.error("Packing AI Error:", error);
      return sendError(res, 500, "Failed to generate packing list");
    }
  }

  static async updateList(req, res) {
    try {
      const { id } = req.params;
      const { items } = req.body;
      const updatedList = await PackingModel.updateItems(id, req.user.id, items);
      return sendSuccess(res, 200, "Packing list updated", updatedList);
    } catch (error) {
      return sendError(res, 500, "Failed to update list");
    }
  }

  static async deleteList(req, res) {
    try {
      const { id } = req.params;
      await PackingModel.delete(id, req.user.id);
      return sendSuccess(res, 200, "Packing list deleted");
    } catch (error) {
      return sendError(res, 500, "Failed to delete list");
    }
  }
}

module.exports = PackingController;
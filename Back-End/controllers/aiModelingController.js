const DecisionIntelligenceService = require('../ai/services/decisionIntelligenceService');
const { sendSuccess, sendError } = require('../utils/responseFormat');

class AIModelingController {
  static async runAll(req, res) {
    try {
      const payload = req.body || {};
      const result = DecisionIntelligenceService.runAll(payload);
      return sendSuccess(res, 200, 'AI modeling (CSP, Game Theory, Logic, Classical Planning) executed', result);
    } catch (error) {
      console.error('AIModelingController.runAll error:', error);
      return sendError(res, 500, 'Failed to execute AI modeling');
    }
  }

  static async runCSP(req, res) {
    try {
      const result = DecisionIntelligenceService.runCspDemo(req.body || {});
      return sendSuccess(res, 200, 'CSP modeling executed', result);
    } catch (error) {
      console.error('AIModelingController.runCSP error:', error);
      return sendError(res, 500, 'Failed to execute CSP modeling');
    }
  }

  static async runGameTheory(req, res) {
    try {
      const result = DecisionIntelligenceService.runGameTheoryDemo(req.body || {});
      return sendSuccess(res, 200, 'Game Theory modeling executed', result);
    } catch (error) {
      console.error('AIModelingController.runGameTheory error:', error);
      return sendError(res, 500, 'Failed to execute Game Theory modeling');
    }
  }

  static async runLogic(req, res) {
    try {
      const result = DecisionIntelligenceService.runLogicDemo(req.body || {});
      return sendSuccess(res, 200, 'Logic representation modeling executed', result);
    } catch (error) {
      console.error('AIModelingController.runLogic error:', error);
      return sendError(res, 500, 'Failed to execute Logic modeling');
    }
  }

  static async runPlanning(req, res) {
    try {
      const result = DecisionIntelligenceService.runPlanningDemo(req.body || {});
      return sendSuccess(res, 200, 'Classical Planning modeling executed', result);
    } catch (error) {
      console.error('AIModelingController.runPlanning error:', error);
      return sendError(res, 500, 'Failed to execute Planning modeling');
    }
  }
}

module.exports = AIModelingController;

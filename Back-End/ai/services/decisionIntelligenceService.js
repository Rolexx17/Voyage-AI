/**
 * Service integrasi:
 * - CSP scheduling mini
 * - Game Theory strategy analysis
 * - Logic knowledge inference
 * - Classical planning for trip flow
 */

const { CSP, solveCSP } = require('../core/csp');
const { NormalFormGame, solveZeroSum2x2 } = require('../core/gameTheory');
const { Literal, Rule, KnowledgeBase } = require('../core/logic');
const { Action, PlanningProblem, planBFS } = require('../core/planning');

class DecisionIntelligenceService {
  static runCspDemo(input = {}) {
    const slots = input.slots || ['morning', 'afternoon', 'evening'];
    const activities = input.activities || ['museum', 'culinary', 'park'];

    const variables = slots;
    const domains = {};
    const neighbors = {};

    for (const s of slots) {
      domains[s] = [...activities];
      neighbors[s] = slots.filter(x => x !== s);
    }

    const csp = new CSP(
      variables,
      domains,
      neighbors,
      (A, a, B, b) => a !== b // all-different
    );

    return solveCSP(csp);
  }

  static runGameTheoryDemo(input = {}) {
    const game = new NormalFormGame(
      ['Traveler', 'Weather'],
      {
        Traveler: ['Outdoor', 'Indoor'],
        Weather: ['Sunny', 'Rainy']
      },
      input.payoffs || {
        'Outdoor|Sunny': [8, 2],
        'Outdoor|Rainy': [1, 9],
        'Indoor|Sunny': [5, 5],
        'Indoor|Rainy': [7, 4]
      }
    );

    const pureNE = game.findPureNashEquilibria();
    const zeroSum = solveZeroSum2x2([[3, -1], [0, 2]]);

    return { pureNE, zeroSum };
  }

  static runLogicDemo(input = {}) {
    const kb = new KnowledgeBase();

    kb.addFacts([
      'hasTicket(user)',
      'passportValid(user)',
      'hotelBooked(user)'
    ]);

    kb.addRule(new Rule(
      [Literal.fromString('hasTicket(user)'), Literal.fromString('passportValid(user)')],
      Literal.fromString('readyForFlight(user)')
    ));

    kb.addRule(new Rule(
      [Literal.fromString('readyForFlight(user)'), Literal.fromString('hotelBooked(user)')],
      Literal.fromString('tripReady(user)')
    ));

    const inference = kb.infer();
    const query = input.query || 'tripReady(user)';
    const entailed = kb.query(query);
    const explanation = kb.explain(query);

    return { inference, query, entailed, explanation };
  }

  static runPlanningDemo(input = {}) {
    const initial = input.initialState || ['at_home', 'ticket_booked', 'passport_valid'];
    const goal = input.goalState || ['at_destination', 'checked_in_hotel'];

    const actions = [
      new Action('go_to_airport', ['at_home'], ['at_airport'], ['at_home']),
      new Action('board_flight', ['at_airport', 'ticket_booked', 'passport_valid'], ['in_flight'], ['at_airport']),
      new Action('arrive_destination', ['in_flight'], ['at_destination'], ['in_flight']),
      new Action('go_to_hotel', ['at_destination'], ['at_hotel_area'], []),
      new Action('checkin_hotel', ['at_hotel_area'], ['checked_in_hotel'], [])
    ];

    const problem = new PlanningProblem(initial, goal, actions);
    return planBFS(problem);
  }

  static runAll(input = {}) {
    return {
      csp: this.runCspDemo(input.csp || {}),
      gameTheory: this.runGameTheoryDemo(input.gameTheory || {}),
      logic: this.runLogicDemo(input.logic || {}),
      planning: this.runPlanningDemo(input.planning || {})
    };
  }
}

module.exports = DecisionIntelligenceService;

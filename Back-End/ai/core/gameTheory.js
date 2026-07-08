/**
 * Game Theory module:
 * - Normal Form Game
 * - Pure strategy Nash Equilibrium finder
 * - Zero-sum 2x2 mixed strategy (closed-form fallback)
 */

class NormalFormGame {
  /**
   * players = ['P1','P2']
   * strategies = { P1: ['A','B'], P2: ['X','Y'] }
   * payoffs key format: "A|X" -> [u1,u2]
   */
  constructor(players, strategies, payoffs) {
    this.players = players;
    this.strategies = strategies;
    this.payoffs = payoffs;
  }

  payoff(s1, s2) {
    const key = `${s1}|${s2}`;
    if (!this.payoffs[key]) throw new Error(`Payoff not defined for ${key}`);
    return this.payoffs[key];
  }

  bestResponsesForP1(s2) {
    const p1 = this.players[0];
    let best = -Infinity;
    const bestSet = [];
    for (const s1 of this.strategies[p1]) {
      const [u1] = this.payoff(s1, s2);
      if (u1 > best) {
        best = u1;
        bestSet.length = 0;
        bestSet.push(s1);
      } else if (u1 === best) bestSet.push(s1);
    }
    return bestSet;
  }

  bestResponsesForP2(s1) {
    const p2 = this.players[1];
    let best = -Infinity;
    const bestSet = [];
    for (const s2 of this.strategies[p2]) {
      const [, u2] = this.payoff(s1, s2);
      if (u2 > best) {
        best = u2;
        bestSet.length = 0;
        bestSet.push(s2);
      } else if (u2 === best) bestSet.push(s2);
    }
    return bestSet;
  }

  findPureNashEquilibria() {
    const p1 = this.players[0];
    const p2 = this.players[1];
    const result = [];

    for (const s1 of this.strategies[p1]) {
      for (const s2 of this.strategies[p2]) {
        const br1 = this.bestResponsesForP1(s2);
        const br2 = this.bestResponsesForP2(s1);
        if (br1.includes(s1) && br2.includes(s2)) {
          result.push({
            strategy: { [p1]: s1, [p2]: s2 },
            payoff: this.payoff(s1, s2)
          });
        }
      }
    }

    return result;
  }
}

/**
 * Solve mixed strategy for 2x2 zero-sum game:
 * matrix for P1:
 * [[a, b],
 *  [c, d]]
 */
function solveZeroSum2x2(matrix) {
  const a = matrix[0][0];
  const b = matrix[0][1];
  const c = matrix[1][0];
  const d = matrix[1][1];

  const denomP = a - b - c + d;
  if (denomP === 0) {
    return {
      valid: false,
      reason: 'Degenerate game (denominator 0), use LP method for general solution.'
    };
  }

  const p = (d - c) / denomP; // prob P1 plays row1
  const q = (d - b) / denomP; // prob P2 plays col1
  const value = (a * d - b * c) / denomP;

  return {
    valid: true,
    mixedStrategy: {
      P1: { row1: p, row2: 1 - p },
      P2: { col1: q, col2: 1 - q }
    },
    gameValue: value
  };
}

module.exports = {
  NormalFormGame,
  solveZeroSum2x2
};

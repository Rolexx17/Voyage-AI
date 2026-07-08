/**
 * Representasi Logika (Propositional + First-Order style facts/rules ringan)
 * - KnowledgeBase
 * - forward chaining
 * - query parser sederhana
 *
 * Tidak bergantung package eksternal.
 */

class Literal {
  constructor(predicate, terms = [], negated = false) {
    this.predicate = predicate;
    this.terms = terms;
    this.negated = negated;
  }

  toString() {
    const args = this.terms.join(',');
    return `${this.negated ? 'not ' : ''}${this.predicate}(${args})`;
  }

  static fromString(input) {
    const trimmed = input.trim();
    const negated = /^not\s+/i.test(trimmed);
    const clean = trimmed.replace(/^not\s+/i, '');
    const match = clean.match(/^([a-zA-Z_]\w*)\((.*)\)$/);
    if (!match) {
      throw new Error(`Invalid literal format: ${input}`);
    }
    const predicate = match[1];
    const argsRaw = match[2].trim();
    const terms = argsRaw ? argsRaw.split(',').map(s => s.trim()) : [];
    return new Literal(predicate, terms, negated);
  }
}

class Rule {
  /**
   * if all antecedents true -> consequent true
   * antecedents: Literal[]
   * consequent: Literal
   */
  constructor(antecedents, consequent) {
    this.antecedents = antecedents;
    this.consequent = consequent;
  }

  toString() {
    return `${this.antecedents.map(a => a.toString()).join(' & ')} => ${this.consequent.toString()}`;
  }
}

class KnowledgeBase {
  constructor() {
    this.facts = new Set(); // store literal.toString() normalized (no variable processing)
    this.rules = [];
  }

  addFact(literal) {
    const lit = literal instanceof Literal ? literal : Literal.fromString(literal);
    this.facts.add(lit.toString());
  }

  addFacts(literals = []) {
    literals.forEach(l => this.addFact(l));
  }

  addRule(rule) {
    if (!(rule instanceof Rule)) throw new Error('rule must be instance of Rule');
    this.rules.push(rule);
  }

  hasFact(literal) {
    const lit = literal instanceof Literal ? literal : Literal.fromString(literal);
    return this.facts.has(lit.toString());
  }

  infer(maxIterations = 1000) {
    let changed = true;
    let iter = 0;

    while (changed && iter < maxIterations) {
      changed = false;
      iter++;

      for (const rule of this.rules) {
        const allTrue = rule.antecedents.every(a => this.facts.has(a.toString()));
        if (allTrue) {
          const c = rule.consequent.toString();
          if (!this.facts.has(c)) {
            this.facts.add(c);
            changed = true;
          }
        }
      }
    }

    return {
      iterations: iter,
      facts: Array.from(this.facts)
    };
  }

  query(queryLiteral) {
    const lit = queryLiteral instanceof Literal ? queryLiteral : Literal.fromString(queryLiteral);
    return this.facts.has(lit.toString());
  }

  explain(queryLiteral) {
    const q = queryLiteral instanceof Literal ? queryLiteral : Literal.fromString(queryLiteral);
    if (this.facts.has(q.toString())) {
      return {
        entailed: true,
        reason: `Fact found directly/inferred in KB: ${q.toString()}`
      };
    }
    return {
      entailed: false,
      reason: `Fact not derivable with current rules/facts: ${q.toString()}`
    };
  }
}

module.exports = {
  Literal,
  Rule,
  KnowledgeBase
};

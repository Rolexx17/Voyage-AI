/**
 * Classical Planning:
 * STRIPS-like representation + BFS planner
 */

class Action {
  constructor(name, preconditions = [], addEffects = [], delEffects = [], cost = 1) {
    this.name = name;
    this.preconditions = new Set(preconditions);
    this.addEffects = new Set(addEffects);
    this.delEffects = new Set(delEffects);
    this.cost = cost;
  }

  isApplicable(stateSet) {
    for (const p of this.preconditions) {
      if (!stateSet.has(p)) return false;
    }
    return true;
  }

  apply(stateSet) {
    const next = new Set(stateSet);
    for (const d of this.delEffects) next.delete(d);
    for (const a of this.addEffects) next.add(a);
    return next;
  }
}

class PlanningProblem {
  constructor(initialState = [], goalState = [], actions = []) {
    this.initialState = new Set(initialState);
    this.goalState = new Set(goalState);
    this.actions = actions;
  }

  goalTest(stateSet) {
    for (const g of this.goalState) {
      if (!stateSet.has(g)) return false;
    }
    return true;
  }
}

function stateKey(stateSet) {
  return Array.from(stateSet).sort().join('|');
}

function planBFS(problem, maxNodes = 50000) {
  const queue = [{
    state: problem.initialState,
    plan: [],
    totalCost: 0
  }];

  const visited = new Set([stateKey(problem.initialState)]);
  let nodes = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    nodes++;
    if (nodes > maxNodes) {
      return { success: false, reason: 'Max nodes exceeded', nodesExpanded: nodes };
    }

    if (problem.goalTest(current.state)) {
      return {
        success: true,
        plan: current.plan,
        totalCost: current.totalCost,
        nodesExpanded: nodes
      };
    }

    for (const action of problem.actions) {
      if (!action.isApplicable(current.state)) continue;
      const nextState = action.apply(current.state);
      const key = stateKey(nextState);
      if (visited.has(key)) continue;
      visited.add(key);

      queue.push({
        state: nextState,
        plan: [...current.plan, action.name],
        totalCost: current.totalCost + action.cost
      });
    }
  }

  return {
    success: false,
    reason: 'No plan found',
    nodesExpanded: nodes
  };
}

module.exports = {
  Action,
  PlanningProblem,
  planBFS
};

/**
 * Classical CSP Solver (Backtracking + MRV + Degree + LCV + Forward Checking)
 * Bisa dipakai untuk:
 * - penjadwalan itinerary
 * - alokasi aktivitas per slot
 */

class CSP {
  constructor(variables = [], domains = {}, neighbors = {}, constraints = null) {
    this.variables = variables;
    this.domains = domains;
    this.neighbors = neighbors;
    this.constraints = constraints || ((A, a, B, b) => true);
  }
}

function deepCloneDomains(domains) {
  const copy = {};
  for (const key of Object.keys(domains)) copy[key] = [...domains[key]];
  return copy;
}

function isConsistent(csp, varName, value, assignment) {
  for (const n of csp.neighbors[varName] || []) {
    if (assignment[n] !== undefined) {
      if (!csp.constraints(varName, value, n, assignment[n])) return false;
    }
  }
  return true;
}

function selectUnassignedVariable(csp, assignment, domains) {
  const unassigned = csp.variables.filter(v => assignment[v] === undefined);

  // MRV
  unassigned.sort((a, b) => {
    const diff = domains[a].length - domains[b].length;
    if (diff !== 0) return diff;

    // Degree heuristic
    const degA = (csp.neighbors[a] || []).filter(n => assignment[n] === undefined).length;
    const degB = (csp.neighbors[b] || []).filter(n => assignment[n] === undefined).length;
    return degB - degA;
  });

  return unassigned[0];
}

function orderDomainValues(csp, varName, assignment, domains) {
  const values = [...domains[varName]];

  // LCV
  values.sort((a, b) => {
    const conflictsA = countConflicts(csp, varName, a, assignment, domains);
    const conflictsB = countConflicts(csp, varName, b, assignment, domains);
    return conflictsA - conflictsB;
  });

  return values;
}

function countConflicts(csp, varName, value, assignment, domains) {
  let conflicts = 0;
  for (const n of csp.neighbors[varName] || []) {
    if (assignment[n] === undefined) {
      for (const v of domains[n]) {
        if (!csp.constraints(varName, value, n, v)) conflicts++;
      }
    }
  }
  return conflicts;
}

function forwardCheck(csp, varName, value, assignment, domains) {
  const revisedDomains = deepCloneDomains(domains);

  for (const n of csp.neighbors[varName] || []) {
    if (assignment[n] !== undefined) continue;

    revisedDomains[n] = revisedDomains[n].filter(v => csp.constraints(varName, value, n, v));
    if (revisedDomains[n].length === 0) return null;
  }

  return revisedDomains;
}

function backtrack(csp, assignment, domains, metrics) {
  if (Object.keys(assignment).length === csp.variables.length) {
    return assignment;
  }

  const varName = selectUnassignedVariable(csp, assignment, domains);
  const orderedValues = orderDomainValues(csp, varName, assignment, domains);

  for (const value of orderedValues) {
    metrics.nodesVisited++;

    if (!isConsistent(csp, varName, value, assignment)) continue;

    const localAssignment = { ...assignment, [varName]: value };
    const checked = forwardCheck(csp, varName, value, localAssignment, domains);

    if (!checked) continue;

    const result = backtrack(csp, localAssignment, checked, metrics);
    if (result) return result;
  }

  return null;
}

function solveCSP(csp) {
  const metrics = { nodesVisited: 0 };
  const solution = backtrack(csp, {}, deepCloneDomains(csp.domains), metrics);
  return {
    success: !!solution,
    solution,
    metrics
  };
}

module.exports = {
  CSP,
  solveCSP
};

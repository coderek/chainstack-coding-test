function getImpliedRoleSet(role, lookupTable) {

  function dfs(visitedSet, target) {
    if (visitedSet.has(target))
      return
    visitedSet.add(target)
    for (const edge of (lookupTable[target] || [])) {
      dfs(visitedSet, edge)
    }
  }

  const roleSet = new Set()
  dfs(roleSet, role)

  return roleSet
}

module.exports = {
  getImpliedRoleSet
}
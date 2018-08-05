/*globals describe, it, expect*/
const { getImpliedRoleSet } = require('../src/helpers')


describe('helper functions', () => {
  it('getImpliedRoleSet', () => {
    expect(Array.from(getImpliedRoleSet('C', {
      'A': ['B'],
      'B': ['C'],
      'C': ['D']
    })).sort()).toEqual(['C', 'D'])

    expect(Array.from(getImpliedRoleSet('A', {
      'A': ['B'],
      'B': ['C'],
      'C': ['D']
    })).sort()).toEqual(['A', 'B', 'C', 'D'])

    expect(Array.from(getImpliedRoleSet('D', {
      'A': ['B'],
      'B': ['C'],
      'C': ['D']
    })).sort()).toEqual(['D'])

    expect(Array.from(getImpliedRoleSet('E', {
      'A': ['B'],
      'B': ['C'],
      'C': ['D']
    })).sort()).toEqual(['E'])

    expect(Array.from(getImpliedRoleSet('A', {
      'A': ['B'],
      'B': ['A', 'E'],
      'C': ['D']
    })).sort()).toEqual(['A', 'B', 'E'])
  })
})
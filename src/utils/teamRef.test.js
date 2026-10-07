/* eslint-env jest */
import { sameTeamId } from './teamRef'

test('compares team ids stored as strings or numbers', () => {
  expect(sameTeamId('10', 10)).toBe(true)
  expect(sameTeamId(10, 10)).toBe(true)
  expect(sameTeamId('10', '11')).toBe(false)
})

test('never matches missing ids', () => {
  expect(sameTeamId(undefined, undefined)).toBe(false)
  expect(sameTeamId(null, 'null')).toBe(false)
  expect(sameTeamId(undefined, 'undefined')).toBe(false)
})

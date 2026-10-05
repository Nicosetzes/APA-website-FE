/* eslint-env jest */
import {
  getLegLabel,
  groupPlayoffSeries,
  normalizeLeg,
  normalizePlayoffMode,
} from './playoffSeries'

test('normalizes legacy fields without changing input', () => {
  const tournament = {}
  const match = {}
  expect(normalizePlayoffMode(tournament)).toBe('single')
  expect(normalizeLeg(match)).toBe(1)
  expect(tournament.playoffMode).toBeUndefined()
  expect(match.leg).toBeUndefined()
})

test('derives labels for managed playoffs and final', () => {
  expect(
    getLegLabel({
      format: 'playoff',
      playoffMode: 'two_legged',
      playoffId: 1,
      leg: 1,
    }),
  ).toBe('Ida')
  expect(
    getLegLabel({
      format: 'playoff',
      playoffMode: 'two_legged',
      playoffId: 1,
      leg: 3,
    }),
  ).toBe('Desempate')
  expect(
    getLegLabel({
      format: 'playoff',
      playoffMode: 'two_legged',
      playoffId: 31,
      leg: 1,
    }),
  ).toBe('Partido único')
  expect(getLegLabel({ format: 'champions_league', leg: 1 })).toBeNull()
})

test('groups by stable tie identity and sorts legs', () => {
  const matches = [
    { _id: 'b', playoff_id: 1, leg: 2, teamP1: { name: 'B' } },
    { _id: 'a', playoff_id: 1, leg: 1, teamP1: { name: 'A' } },
    { _id: 'c', playoff_id: 2, leg: 1 },
  ]
  const groups = groupPlayoffSeries(matches, 't')
  expect(groups).toHaveLength(2)
  expect(groups[0].key).toBe('t:1')
  expect(groups[0].matches.map(({ leg }) => leg)).toEqual([1, 2])
})

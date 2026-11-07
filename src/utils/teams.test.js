/* eslint-env jest */
import { teamAbbreviation, teamLogoUrl } from './teams'

jest.mock('api', () => ({ database: 'http://db' }))

describe('teamAbbreviation', () => {
  test('takes the first 3 letters in uppercase, like /matches', () => {
    expect(teamAbbreviation('Boca Juniors')).toBe('BOC')
    expect(teamAbbreviation('river')).toBe('RIV')
    expect(teamAbbreviation('Lanús')).toBe('LAN')
  })
  test('keeps short names whole', () => {
    expect(teamAbbreviation('PSG')).toBe('PSG')
    expect(teamAbbreviation('Ei')).toBe('EI')
  })
  test('returns null without a name', () => {
    expect(teamAbbreviation(null)).toBeNull()
    expect(teamAbbreviation(undefined)).toBeNull()
    expect(teamAbbreviation('')).toBeNull()
  })
})

describe('teamLogoUrl', () => {
  test('points at the crest of the team id', () => {
    expect(teamLogoUrl(12)).toBe('http://db/logos/12')
    expect(teamLogoUrl('7')).toBe('http://db/logos/7')
  })
})

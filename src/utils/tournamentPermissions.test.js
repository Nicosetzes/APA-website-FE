/* eslint-env jest */
import { canMutateTournament } from './tournamentPermissions'

describe('canMutateTournament', () => {
  test('returns false for anonymous users and missing data', () => {
    expect(canMutateTournament()).toBe(false)
    expect(canMutateTournament({}, null)).toBe(false)
    expect(canMutateTournament(null, { id: 'user-1' })).toBe(false)
    expect(canMutateTournament({}, { id: '   ' })).toBe(false)
    expect(canMutateTournament({ players: ['user-1'] }, 'user-1')).toBe(false)
  })

  test('returns false for an outsider', () => {
    const tournament = {
      players: [{ id: 'participant-1' }],
      teams: [{ player: { id: 'participant-2' } }],
    }

    expect(canMutateTournament(tournament, { id: 'outsider' })).toBe(false)
  })

  test('returns true for a participant listed in players', () => {
    const tournament = { players: [{ id: 'participant-1' }] }

    expect(canMutateTournament(tournament, { id: 'participant-1' })).toBe(true)
  })

  test('falls back to teams player membership', () => {
    const tournament = {
      teams: [{ player: { _id: 'participant-1' } }],
    }

    expect(canMutateTournament(tournament, { _id: 'participant-1' })).toBe(true)
  })

  test('normalizes id, _id, scalar, string and number identifiers', () => {
    expect(
      canMutateTournament({ players: [42] }, { _id: { id: ' 42 ' } }),
    ).toBe(true)
    expect(canMutateTournament({ teams: [{ player: ' 7 ' }] }, { id: 7 })).toBe(
      true,
    )
    expect(canMutateTournament({ players: [{ _id: 9 }] }, { id: ' 9 ' })).toBe(
      true,
    )
  })

  test('returns true for a superadmin without requiring tournament membership', () => {
    expect(canMutateTournament({}, { role: 'superadmin' })).toBe(true)
    expect(canMutateTournament({}, { id: 'admin-1', role: 'superadmin' })).toBe(
      true,
    )
  })

  test('does not normalize role values the backend would reject', () => {
    expect(
      canMutateTournament({}, { id: 'admin-1', role: ' SuperAdmin ' }),
    ).toBe(false)
  })
})

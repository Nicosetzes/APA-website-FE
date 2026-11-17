/* eslint-env jest */
import { getTournamentFormatLabel } from './tournamentFormat'

test('returns the display label for every tournament format used by the API', () => {
  expect(getTournamentFormatLabel('american_cup')).toBe('Copa América')
  expect(getTournamentFormatLabel('champions_league')).toBe('Champions League')
  expect(getTournamentFormatLabel('club_world_cup')).toBe('Mundial de clubes')
  expect(getTournamentFormatLabel('league')).toBe('Torneo largo')
  expect(getTournamentFormatLabel('league_playin_playoff')).toBe(
    'Superliga APA',
  )
  expect(getTournamentFormatLabel('playoff')).toBe('Eliminatoria')
  expect(getTournamentFormatLabel('super_cup')).toBe('Supercopa APA')
  expect(getTournamentFormatLabel('world_cup')).toBe(
    'Copa del Mundo (formato clásico)',
  )
  expect(getTournamentFormatLabel('world_cup_2026')).toBe(
    'Copa del Mundo (formato nuevo)',
  )
})

test('keeps unknown values and labels missing legacy data', () => {
  expect(getTournamentFormatLabel('future_format')).toBe('future_format')
  expect(getTournamentFormatLabel()).toBe('Formato no registrado')
})

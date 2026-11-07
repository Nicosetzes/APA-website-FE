// Datos de prueba de `GET /ratings/history` (no es un test: CRA solo corre
// los archivos *.test.js). Dos jugadores y tres partidos, con los números
// coherentes entre sí (rating = anterior + delta). Partido m1: Nico (Boca) 2-1
// Santi (River). Partido m3: Nico (Lanús) 0-1 Santi (Racing). Los equipos
// llevan id (Boca 1, River 2, Lanús 3, Racing 4) para pedir el escudo.
// Equipos como los manda el BE: `{ id, name }`.
export const BOCA = { id: 1, name: 'Boca' }
export const RIVER = { id: 2, name: 'River' }
export const LANUS = { id: 3, name: 'Lanús' }
export const RACING = { id: 4, name: 'Racing' }

const T1 = '2026-10-10T15:00:00.000Z'
const T2 = '2026-10-10T16:00:00.000Z'
const T3 = '2026-10-11T15:00:00.000Z'

// Torneos: ids hex de 24 como los de Mongo. Solo LIGA_ID y COPA_ID están en la
// lista de activos (`GET /tournaments?legacy=false`); VIEJO_ID no.
export const LIGA_ID = '0123456789abcdef01234567'
export const COPA_ID = '76543210fedcba9876543210'
export const VIEJO_ID = 'aaaaaaaaaaaaaaaaaaaaaaaa'

export const ACTIVE_TOURNAMENTS = [
  { _id: COPA_ID, name: 'Copa APA' },
  { _id: LIGA_ID, name: 'Liga APA' },
]

export const TIMELINE = [
  { x: 1, seq: 101, t: T1 },
  { x: 2, seq: 102, t: T2 },
  { x: 3, seq: 103, t: T3 },
]

const point = (overrides) => ({
  tournament: 'Liga APA',
  type: 'league',
  penalties: null,
  ...overrides,
})

export const NICO = {
  player: { id: 'n', name: 'Nico' },
  start: { rating: 1500, matches: 10 },
  end: { rating: 1503, matches: 12 },
  summary: {
    ratingChange: 3,
    min: { rating: 1500, seq: null, t: null },
    max: { rating: 1510, seq: 101, t: T1 },
    matchesInPeriod: 2,
    record: { wins: 1, draws: 0, losses: 1 },
    position: 1,
    previousPosition: 2,
    positionChange: 1,
    biggestUpsetWon: {
      matchId: 'm1',
      t: T1,
      opponent: { id: 's', name: 'Santi' },
      expectedScore: 0.45,
      ratingSwing: 10,
      score: { for: 2, against: 1 },
      teams: { for: BOCA, against: RIVER },
      ratingChange: 10,
      probability: { kind: 'win', for: 0.34, against: 0.46 },
    },
    worstUpsetLost: {
      matchId: 'm3',
      t: T3,
      opponent: { id: 's', name: 'Santi' },
      expectedScore: 0.62,
      ratingSwing: 7,
      score: { for: 0, against: 1 },
      teams: { for: LANUS, against: RACING },
      ratingChange: -7,
      probability: { kind: 'advance', for: 0.62, against: 0.38 },
    },
    provisional: false,
  },
  points: [
    point({
      seq: 101,
      x: 1,
      matchId: 'm1',
      t: T1,
      rating: 1510,
      delta: 10,
      games: 11,
      opponent: { id: 's', name: 'Santi' },
      score: { for: 2, against: 1 },
      teams: { for: BOCA, against: RIVER },
      expectedScore: 0.45,
      probability: { kind: 'win', for: 0.34, against: 0.46 },
    }),
    point({
      seq: 103,
      x: 3,
      matchId: 'm3',
      t: T3,
      rating: 1503,
      delta: -7,
      games: 12,
      opponent: { id: 's', name: 'Santi' },
      score: { for: 0, against: 1 },
      teams: { for: LANUS, against: RACING },
      expectedScore: 0.62,
      probability: { kind: 'advance', for: 0.62, against: 0.38 },
    }),
  ],
}

export const SANTI = {
  player: { id: 's', name: 'Santi' },
  start: { rating: 1500, matches: 8 },
  end: { rating: 1497, matches: 10 },
  summary: {
    ratingChange: -3,
    min: { rating: 1490, seq: 101, t: T1 },
    max: { rating: 1500, seq: null, t: null },
    matchesInPeriod: 2,
    record: { wins: 1, draws: 0, losses: 1 },
    position: 2,
    previousPosition: 1,
    positionChange: -1,
    biggestUpsetWon: {
      matchId: 'm3',
      t: T3,
      opponent: { id: 'n', name: 'Nico' },
      expectedScore: 0.38,
      ratingSwing: 7,
      score: { for: 1, against: 0 },
      teams: { for: RACING, against: LANUS },
      ratingChange: 7,
      probability: { kind: 'advance', for: 0.38, against: 0.62 },
    },
    worstUpsetLost: {
      matchId: 'm1',
      t: T1,
      opponent: { id: 'n', name: 'Nico' },
      expectedScore: 0.55,
      ratingSwing: 10,
      score: { for: 1, against: 2 },
      teams: { for: RIVER, against: BOCA },
      ratingChange: -10,
      probability: { kind: 'win', for: 0.46, against: 0.34 },
    },
    provisional: false,
  },
  points: [
    point({
      seq: 101,
      x: 1,
      matchId: 'm1',
      t: T1,
      rating: 1490,
      delta: -10,
      games: 9,
      opponent: { id: 'n', name: 'Nico' },
      score: { for: 1, against: 2 },
      teams: { for: RIVER, against: BOCA },
      expectedScore: 0.55,
      probability: { kind: 'win', for: 0.46, against: 0.34 },
    }),
    point({
      seq: 103,
      x: 3,
      matchId: 'm3',
      t: T3,
      rating: 1497,
      delta: 7,
      games: 10,
      opponent: { id: 'n', name: 'Nico' },
      score: { for: 1, against: 0 },
      teams: { for: RACING, against: LANUS },
      expectedScore: 0.38,
      probability: { kind: 'advance', for: 0.38, against: 0.62 },
    }),
  ],
}

// `data.tournaments` de un período: la Liga (partidos 1 a 3) y un torneo que ya
// no está entre los activos.
export const TOURNAMENT_MARKS = [
  {
    id: LIGA_ID,
    name: 'Liga APA',
    fromX: 1,
    toX: 3,
    matches: 3,
    fromT: T1,
    toT: T3,
  },
  {
    id: VIEJO_ID,
    name: 'Torneo viejo',
    fromX: 2,
    toX: 2,
    matches: 1,
    fromT: T2,
    toT: T2,
  },
]

/** Respuesta de `/ratings/history` (el cuerpo completo, con `data`). */
export const historyResponse = (overrides = {}) => ({
  success: true,
  dateFrom: '2026-10-10',
  dateTo: '2026-10-11',
  scope: { type: 'period', tournament: null },
  data: {
    matchesInPeriod: 3,
    players: [NICO, SANTI],
    matchesTimeline: TIMELINE,
    highlights: { biggestUpset: null },
    tournaments: TOURNAMENT_MARKS,
    ...overrides,
  },
})

// En modo torneo el BE no manda posición (viene `null`).
const withoutPosition = (entry) => ({
  ...entry,
  summary: {
    ...entry.summary,
    position: null,
    previousPosition: null,
    positionChange: null,
  },
})

/**
 * Respuesta de `/ratings/history?tournamentId=<LIGA_ID>`: mismos partidos que
 * `historyResponse`, con `scope` de torneo, rango del torneo y sin posiciones.
 */
export const tournamentResponse = (overrides = {}) => ({
  success: true,
  dateFrom: '2026-10-10',
  dateTo: '2026-10-11',
  scope: { type: 'tournament', tournament: { id: LIGA_ID, name: 'Liga APA' } },
  data: {
    matchesInPeriod: 3,
    players: [withoutPosition(NICO), withoutPosition(SANTI)],
    matchesTimeline: TIMELINE,
    highlights: { biggestUpset: null },
    tournaments: [TOURNAMENT_MARKS[0]],
    ...overrides,
  },
})

/** `data` como lo entrega `useRatingHistory` (con el rango pedido). */
export const historyData = (overrides = {}) => ({
  ...historyResponse(overrides).data,
  dateFrom: '2026-10-10',
  dateTo: '2026-10-11',
})

/**
 * Un jugador como lo devolvería un BE intermedio (v3): `teams` con el nombre
 * como texto, sin ids de equipo.
 */
export const withNameOnlyTeams = (entry) => {
  const names = (source) => ({
    ...source,
    teams: {
      for: source.teams.for?.name ?? null,
      against: source.teams.against?.name ?? null,
    },
  })
  const upset = (value) => value && names(value)
  return {
    ...entry,
    summary: {
      ...entry.summary,
      biggestUpsetWon: upset(entry.summary.biggestUpsetWon),
      worstUpsetLost: upset(entry.summary.worstUpsetLost),
    },
    points: entry.points.map(names),
  }
}

/**
 * Un jugador como lo devolvería un BE anterior: sin `teams` ni `penalties` en
 * los puntos ni en los upsets.
 */
export const withoutTeams = (entry) => {
  const stripPoint = (source) => {
    const copy = { ...source }
    delete copy.teams
    delete copy.penalties
    return copy
  }
  const stripUpset = (upset) => upset && stripPoint(upset)
  return {
    ...entry,
    summary: {
      ...entry.summary,
      biggestUpsetWon: stripUpset(entry.summary.biggestUpsetWon),
      worstUpsetLost: stripUpset(entry.summary.worstUpsetLost),
    },
    points: entry.points.map(stripPoint),
  }
}
